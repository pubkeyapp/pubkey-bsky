import { AppBskyActorDefs } from '@atproto/api'
import { Anchor, Avatar, Badge, Box, Button, ButtonProps, createStyles, Flex, Group, Loader, rem } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAtp } from '../../atp/atp-provider'
import { followUser } from '../../atp/followUser'
import { unfollowUser } from '../../atp/unfollowUser'

type Props = {
  user: AppBskyActorDefs.ProfileViewDetailed;
  revalidate?: () => void;
  className?: string;
};
const useStyles = createStyles((theme) => ({
  item: {
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

}));
export default function UserListItem({ user, revalidate, className }: Props) {
  const { atp } = useAtp();
  const { classes } = useStyles();

  const { mutate: mutateFollowState, isLoading: isMutating } = useMutation(
    async (isFollow: boolean) => {
      // TODO: error handling
      if (!atp.session) return;
      if (isFollow) {
        await followUser({
          repo: atp.session.did,
          did: user.did,
        });
      } else {
        if (!user.viewer?.following) return;
        await unfollowUser({ uri: user.viewer.following });
      }
      revalidate?.();
    }
  );

  const loading = isMutating;
  const buttonProps = {
    size: "sm",
    radius: 'xl',
    disabled: loading,
    leftIcon: loading ? <Loader size="sm" /> : undefined,
  } satisfies ButtonProps;

  return (
    <Flex p='md' className={classes.item}>
      <Group sx={{flexGrow: 1}}>
        <Avatar src={user.avatar} size="lg" radius={50}  />
        <Group >
          <Box>
            <Anchor component={Link} to={`/profile/${user.handle}`} className={"clickable-overlay"}>
              {user.displayName && (
                <div >{user.displayName}</div>
              )}
              <div >@{user.handle}</div>
            </Anchor>
            {user.viewer?.followedBy ? (
              <div>
                <Badge color='gray' size='sm'>
                  Follows you
                </Badge>
              </div>
            ) : null }
          </Box>
        </Group>

      </Group>

      <Group>
        {user.viewer?.following ? (
          <Button
            variant="default"
            onClick={() => mutateFollowState(false)}
            {...buttonProps}
          >
            Following
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => mutateFollowState(true)}
            {...buttonProps}
          >
            Follow
          </Button>
        )}
      </Group>
    </Flex>
  );
}
