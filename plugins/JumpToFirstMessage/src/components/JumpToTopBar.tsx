import ChannelSummariesExperiment from "@common/experiments/ChannelSummariesExperiment";
import ReadStateStore from "@common/stores/ReadStateStore";
import classNames from "classnames";
import type React from "react";
import { common, components } from "replugged";
import { cfg } from "../settings";
import type { MessagesProps } from "../types";
import DoubleDownArrow from "./DoubleDownArrow";

import "./JumpToTopBar.css";

const { i18n, messages } = common;
const { Clickable, ErrorBoundary, Loader: Spinner } = components;

type JumpToTopBarProps = Pick<MessagesProps, "channel" | "messages" | "unreadCount">;

function JumpToTopBar(props: JumpToTopBarProps): React.ReactElement | null {
  const { channel, messages: channelMessages, unreadCount } = props;
  const { jumpTargetId, loadingMore } = channelMessages;

  // Check if the first message cached is the first message in a forum post
  // if not, we need to add an extra margin to the top of the container
  const firstMessageCached = channelMessages.first();
  const firstMessageInPost: boolean =
    channelMessages.length > 0 && firstMessageCached
      ? // @ts-expect-error discord-types is terribly outdated
        firstMessageCached.isFirstMessageInForumPost(channel)
      : false;
  // @ts-expect-error discord-types is terribly outdated x2
  const hasNoticeAbove: boolean = channel.isForumPost() && !firstMessageInPost;

  // Check if the channel can have "channel summaries" and add an extra margin
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const hasTopicsBarAbove = ChannelSummariesExperiment?.canSeeChannelSummaries(channel);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const unreadMessageId = ReadStateStore?.getOldestUnreadMessageId(channel.id) ?? "0";

  const jumpTargetIsFirstMessage = jumpTargetId === channel.id;
  const jumpTargetIsUnreadMessage = jumpTargetId === unreadMessageId;
  const canShow = hasNoticeAbove || channelMessages.hasMoreBefore;

  const align = cfg.get("align");

  return channelMessages.hasFetched && canShow ? (
    <div
      className={classNames(
        "jumpToFirstMessage-container",
        { containerMarginTop: hasNoticeAbove || hasTopicsBarAbove || unreadCount > 0 },
        { containerMarginTopExtra: hasNoticeAbove && hasTopicsBarAbove },
        { [align]: align },
      )}>
      <Clickable
        aria-label={i18n.Messages.JUMPTOFIRSTMESSAGE_JUMP_BUTTON_A11Y_LABEL}
        className="jumpToFirstMessage-navigator"
        onClick={() => {
          const jumpToUnread = cfg.get("jumpToUnread");
          const messageIdUnread = jumpTargetIsUnreadMessage ? channel.id : unreadMessageId;
          const messageId = jumpToUnread ? messageIdUnread : channel.id;

          void messages.jumpToMessage({
            channelId: channel.id,
            messageId,
          });
        }}>
        <div className="jumpToFirstMessage-button">
          {loadingMore && (jumpTargetIsFirstMessage || jumpTargetIsUnreadMessage) ? (
            <Spinner
              type={Spinner.Type.SPINNING_CIRCLE}
              className="jumpToFirstMessage-jumpSpinner"
            />
          ) : (
            <DoubleDownArrow className="jumpToFirstMessage-icon" />
          )}
        </div>
      </Clickable>
    </div>
  ) : null;
}

export default (props: JumpToTopBarProps): React.ReactElement => {
  return (
    <ErrorBoundary fallback={<></>}>
      <JumpToTopBar {...props} />
    </ErrorBoundary>
  );
};
