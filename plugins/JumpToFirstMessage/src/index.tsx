import type React from "react";
import { i18n } from "replugged";
import JumpToTopBar from "./components/JumpToTopBar";
import Settings from "./components/Settings";
import translations from "./i18n";
import { cfg } from "./settings";
import type { MessagesProps } from "./types";

let stopped = false;

export function _renderJumpToTopBar(props: MessagesProps): React.ReactNode {
  const { channel, messages, unreadCount } = props;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!channel || !messages) return null;

  const forumsOnly = cfg.get("forumsOnly");
  // @ts-expect-error discord-types is terribly outdated
  if (forumsOnly && !channel.isForumPost()) return null;

  return stopped ? null : (
    <JumpToTopBar channel={channel} messages={messages} unreadCount={unreadCount} />
  );
}

export { Settings, cfg };

export function start(): void {
  i18n.loadAllStrings(translations);

  stopped = false;
}

export function stop(): void {
  stopped = true;
}
