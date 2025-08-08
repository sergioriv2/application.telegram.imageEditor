import { BotCommand, BotCommandsDescription } from '../../constants/bot-commands.constants';
import { StartCommandHandler } from '../commands/handlers/start.handler';
import { ChatDetailService } from '../services/chat-detail-service';
import { ImageService } from '../services/image-service';
import { ChatResponses, StartMessage } from '../../constants/response-constants';
import { ResizeImageHandler } from '../commands/handlers/resize-image.handler';
import { BotCommandGroup } from './bot-command-group.model';
import { ConfirmResizeImageHandler } from '../commands/handlers/confirm-resize-image.handler';

export class BotCommandModel {
  readonly groups: Map<string, BotCommandGroup>;

  constructor(
    private chatContextService: ChatDetailService,
    private imageService: ImageService,
  ) {
    this.groups = new Map<string, BotCommandGroup>();
    this.registerCommands();
  }

  private registerCommands() {
    this.groups.set(
      BotCommand.Start,
      new BotCommandGroup(
        BotCommand.Start,
        BotCommandsDescription.Start,
        new StartCommandHandler(this.chatContextService),
        (msg) => ({
          chatId: msg.chat.id,
        }),
        StartMessage.Response,
      ),
    );

    this.groups.set(
      BotCommand.ResizeImage,
      new BotCommandGroup(
        BotCommand.ResizeImage,
        BotCommandsDescription.ResizeImage,
        new ResizeImageHandler(this.chatContextService),
        (msg) => ({
          chatId: msg.chat.id,
        }),
        ChatResponses.ChatInit,
      ),
    );

    this.groups.set(
      BotCommand.ConfirmResizeImage,
      new BotCommandGroup(
        BotCommand.ConfirmResizeImage,
        BotCommandsDescription.ConfirmResizeImage,
        new ConfirmResizeImageHandler(this.chatContextService),
        (msg) => ({
          chatId: msg.chat.id,
        }),
        ChatResponses.ImageNotSquareConfirmed,
      ),
    );
  }
}
