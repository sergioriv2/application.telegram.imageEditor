import { BotCommand, BotCommandsDescription } from '../../constants/bot-commands.constants';
import { StartCommandHandler } from '../commands/handlers/start.handler';
import { ChatDetailService } from '../services/chat-detail-service';
import { ImageService } from '../services/image-service';
import { CropImageResponses, StartMessage } from '../../constants/response-constants';
import { CropImageHandler } from '../commands/handlers/crop-image.handler';
import { BotCommandGroup } from './bot-command-group.model';

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
      BotCommand.CropImage,
      new BotCommandGroup(
        BotCommand.CropImage,
        BotCommandsDescription.CropImage,
        new CropImageHandler(this.chatContextService, this.imageService),
        (msg) => ({
          chatId: msg.chat.id,
        }),
        CropImageResponses.ChatInit,
      ),
    );
  }
}
