import { Button, H1, SizableText, XStack, YStack } from 'tamagui'
import { authClient, useAuth } from '~/better-auth/client'
import { Avatar } from '~/interface/Avatar'

export function HomePage() {
  const { user } = useAuth()

  return (
    <YStack
      $platform-ios={{ pt: '$10' }}
      f={1}
      p="$4"
      gap="$4"
      ai="flex-start"
      maw={600}
      w="100%"
      als="center"
    >
      <H1>SST Zero Template</H1>

      {user ? (
        <XStack ai="center" gap="$4">
          <Avatar image={user.image || ''} />
          <SizableText>{user.name}</SizableText>

          <Button onPress={() => authClient.signOut()}>Logout</Button>
        </XStack>
      ) : (
        <Button
          onPress={() => {
            authClient.signIn.social({
              provider: 'github',
              callbackURL: '/'
            })
          }}
        >
          Login with Github
        </Button>
      )}
    </YStack>
  )
}
