export enum ChatContextStates {
  ChatInit = 'ChatInit',
  BotWaitingForImage = 'BotWaitingForImage',
  UserSendingImage = 'UserSendingImage',
  BotProcessingImage = 'BotProcessingImage',
  UserWaitingForBotImage = 'UserWaitingForBotImage',
  CroppedImageDelivered = 'CroppedImageDelivered',
}
