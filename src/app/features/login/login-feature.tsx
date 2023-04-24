import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtp } from '../../atp/atp-provider'
import { showNotificationError, showNotificationSuccess } from '../../ui/notifications'

export function LoginFeature() {
  return (
    <Stack h={'100%'} align="center" justify="center">
      <AuthenticationForm />
    </Stack>
  )
}

export function AuthenticationForm(props: PaperProps) {
  const { atp, refresh } = useAtp()
  const navigate = useNavigate()
  const form = useForm({
    initialValues: {
      identifier: '',
      password: '',
    },

    validate: {
      identifier: (val) => (val.length < 3 ? 'Invalid identifier' : null),
      password: (val) => (val.length !== 19 ? 'Password should be 19 characters long' : null),
    },
  })

  const uri = useMemo(() => {
    return atp.api.xrpc.uri
  }, [atp])

  return (
    <Paper radius="xl" p="xl" withBorder {...props}>
      <Text size="lg" weight={500} mb="lg">
        Welcome to PubKey
      </Text>

      <form
        onSubmit={form.onSubmit(() => {
          console.log('Form submitted', form.values)

          if (!form.values.identifier || !form.values.password) {
            showNotificationError('Please fill in all fields')
            return
          }

          atp
            .login({
              identifier: form.values.identifier,
              password: form.values.password,
            })
            .then((res) => {
              showNotificationSuccess('Logged in successfully')
              return refresh()
            })
            .then(() => navigate('/home'))
            .catch((err) => {
              console.log(err)
              showNotificationError('Error logging in')
            })
        })}
      >
        <Stack>
          <TextInput label="Server" disabled defaultValue={uri?.toString()} radius="xl" size="lg" />

          <TextInput
            required
            label="Username or emaila address"
            placeholder="you.bsky.social"
            value={form.values.identifier}
            onChange={(event) => form.setFieldValue('identifier', event.currentTarget.value)}
            error={form.errors.identifier && 'Invalid identifier'}
            radius="xl"
            size="lg"
          />

          <PasswordInput
            required
            label="Password"
            description={
              <Text color="dimmed">
                You need an{' '}
                <Anchor
                  href="https://staging.bsky.app/settings/app-passwords"
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  app password
                </Anchor>{' '}
                to sign in.
              </Text>
            }
            placeholder="xxxx-xxxx-xxxx-xxxx"
            pattern={`.{4}-.{4}-.{4}-.{4}`} // TODO: is there any way to convert a RegExp to string?
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should be 19 characters long'}
            radius="xl"
            size="lg"
            name="password"
            type="password"
          />
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor type="button" color="dimmed" href="https://staging.bsky.app" size="xs" target="_blank">
            Don't have an account? Register
          </Anchor>
          <Button type="submit" radius="xl" size="lg">
            Sign in
          </Button>
        </Group>
      </form>
    </Paper>
  )
}
