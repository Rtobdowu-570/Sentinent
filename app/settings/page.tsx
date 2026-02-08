import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Calendar, CreditCard, Zap, RefreshCw } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { prisma } from '@/lib/prisma'

interface SubscriptionData {
  plan: string
  monthlyUsage: number
  monthlyLimit: number
  resetDate: string
  usagePercentage: number
}

async function getSubscriptionData(userId: string): Promise<SubscriptionData | null> {
  try {
    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { subscription: true },
    })

    // If user doesn't exist, create them
    if (!user) {
      const clerkUser = await currentUser()
      if (!clerkUser) return null

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null,
          imageUrl: clerkUser.imageUrl,
          subscription: {
            create: {
              plan: 'free',
              monthlyUsage: 0,
              monthlyLimit: 5,
              resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            },
          },
        },
        include: { subscription: true },
      })
    }

    // If subscription doesn't exist, create it
    if (!user.subscription) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: 'free',
          monthlyUsage: 0,
          monthlyLimit: 5,
          resetDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      })

      // Refetch user with subscription
      user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { subscription: true },
      })
    }

    if (!user?.subscription) return null

    const usagePercentage = Math.round(
      (user.subscription.monthlyUsage / user.subscription.monthlyLimit) * 100
    )

    return {
      plan: user.subscription.plan,
      monthlyUsage: user.subscription.monthlyUsage,
      monthlyLimit: user.subscription.monthlyLimit,
      resetDate: user.subscription.resetDate.toISOString(),
      usagePercentage,
    }
  } catch (error) {
    console.error('Error fetching subscription data:', error)
    return null
  }
}

export default async function SettingsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const user = await currentUser()
  const subscriptionData = await getSubscriptionData(userId)

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Unable to load user information. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const userName = user.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user.username || 'User'

  const userEmail = user.emailAddresses[0]?.emailAddress || 'No email'
  const joinDate = user.createdAt ? formatDate(new Date(user.createdAt).toISOString()) : 'Unknown'

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details and profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.imageUrl} alt={userName} />
                <AvatarFallback className="text-lg">{getInitials(userName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{userName}</h3>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">{userName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground break-all">{userEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">{joinDate}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription & Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription & Usage</CardTitle>
            <CardDescription>Your current plan and usage statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {subscriptionData ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Plan</p>
                      <p className="text-2xl font-bold capitalize">{subscriptionData.plan}</p>
                    </div>
                  </div>
                  <Badge variant={subscriptionData.plan === 'free' ? 'secondary' : 'default'} className="text-sm">
                    {subscriptionData.plan === 'free' ? 'Free Tier' : 'Pro Tier'}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Monthly Usage</p>
                        <p className="text-sm text-muted-foreground">
                          {subscriptionData.monthlyUsage} of {subscriptionData.monthlyLimit} researches used
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-semibold">
                      {subscriptionData.monthlyUsage} / {subscriptionData.monthlyLimit}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(subscriptionData.usagePercentage, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {subscriptionData.usagePercentage}% of monthly limit used
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Usage Resets</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(subscriptionData.resetDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {subscriptionData.plan === 'free' && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">Upgrade to Pro</p>
                    <p className="text-sm text-muted-foreground">
                      Get 100 researches per month and unlock advanced features
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Unable to load subscription information</p>
            )}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-1">Theme Preference</p>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color theme
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
