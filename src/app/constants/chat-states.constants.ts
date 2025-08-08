export enum ChatState {
  ChatInit = 'ChatInit',
  BotWaitingForImage = 'BotWaitingForImage',
  CroppedImageDelivered = 'CroppedImageDelivered',
  ImageNotSquareWaitingConfirmation = 'ImageNotSquareWaitingConfirmation',
  ImageNotSquareWaitingConfirmed = 'ImageNotSquareWaitingConfirmed',
  BotProcessingImage = 'BotProcessingImage',
  // UserWaitingForBotImage = 'UserWaitingForBotImage',
}
