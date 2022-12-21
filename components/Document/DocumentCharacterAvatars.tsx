import { AvatarStack } from "../../primitives/AvatarStack";
import { User } from '../../types';
import styles from "./DocumentCharacterAvatars.module.css";

type DocumentCharacterAvatarsProps = {
  avatars: (User | null)[]
}
export function DocumentCharacterAvatars({ avatars, ...props }: DocumentCharacterAvatarsProps) {

  return (
    <AvatarStack
      avatars={avatars.filter(x => x != null).map((user) => ({
        name: user?.name ?? "",
        src: user?.avatar ?? "",
        color: user?.color ?? "",
      }))}
      max={5}
      size={8}
      tooltip
      tooltipProps={{ sideOffset: 28 }}
    />
  );
}
