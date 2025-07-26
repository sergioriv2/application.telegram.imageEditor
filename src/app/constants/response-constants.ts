export enum CropImageResponses {
  ChatInit = 'Genial! Para empezar mandame la imagen sin ccomprimir que deseas recortar y te la mandare como un archivo .png con el tamaño estandar para los stickers de Telegram (512x512)',
  ImageNotSentOnBotWaitingForImage = 'El mensaje enviado no es una foto valida. Empecemos de nuevo',
  CroppedImageDelivered = 'Acá esta la version recortada del archivo',
}

export enum StartMessage {
  Response = 'Hola! 😊 ✨',
}
