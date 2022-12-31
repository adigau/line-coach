import { User } from "../types";

/**
 * This array simulates a database consisting of a list of users.
 * After signing up with your auth solution (e.g. GitHub, Auth0)
 * place your user info in an object, with the email address you used
 * as the id.
 * The groupIds are the names of the groups the user is part of.
 * Group info is in /data/groups.ts
 */
export const users: Omit<User, "color">[] = [
  /*
  {
    id: "[YOUR EMAIL ADDRESS]",
    name: "[YOUR DISPLAY NAME]",
    avatar: "https://liveblocks.io/avatars/avatar-0.png",
    groupIds: ["theatre.parenthese", "warner.bros", "the.old.vic"],
  },
  */
  {
    id: "adrien.gaudon",
    name: "Adrien Gaudon",
    avatar: "https://media.licdn.com/dms/image/C4D03AQH5Qmp0g5cdbA/profile-displayphoto-shrink_400_400/0/1621607347997?e=1677715200&v=beta&t=L6agGsQrpbSmKl6l9hHmJQoO8KAyDr_SS77f1pKa6Us",
    groupIds: ["theatre.parenthese", "warner.bros", "the.old.vic"],
  },
  {
    id: "alain",
    name: "Alain",
    avatar: "https://media.licdn.com/dms/image/C5603AQEyWQhXH_4Llg/profile-displayphoto-shrink_400_400/0/1655663054749?e=1677715200&v=beta&t=AC3llri1qyzV6JFpDZnLTUuqAPmB5v9Opb5jT3PAYY4",
    groupIds: ["theatre.parenthese", "warner.bros", "the.old.vic"],
  },
  {
    id: "ali.benarbia",
    name: "Ali Benarbia",
    avatar: "https://liveblocks.io/avatars/avatar-2.png",
    groupIds: ["theatre.parenthese", "warner.bros", "the.old.vic"],
  },
  {
    id: "talal.el.karkouri",
    name: "Talal El Karkouri",
    avatar: "https://liveblocks.io/avatars/avatar-3.png",
    groupIds: ["warner.bros", "the.old.vic"],
  },
  {
    id: "jay.jay.okocha",
    name: "Jay Jay Okocha",
    avatar: "https://liveblocks.io/avatars/avatar-4.png",
    groupIds: ["theatre.parenthese", "the.old.vic"],
  },
  {
    id: "lionel.letizi",
    name: "Lionel Letizi",
    avatar: "https://liveblocks.io/avatars/avatar-5.png",
    groupIds: ["theatre.parenthese", "warner.bros"],
  },
  {
    id: "eric.abesandratana",
    name: "Eric Rabesandratana",
    avatar: "https://liveblocks.io/avatars/avatar-6.png",
    groupIds: ["warner.bros"],
  }
];
