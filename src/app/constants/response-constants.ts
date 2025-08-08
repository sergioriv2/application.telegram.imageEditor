export enum ChatResponses {
  ChatInit = 'Enviame una imagen sin comprimir que deseas ajustar el tamaño y te la mandare como un archivo .png con el tamaño estándar para los stickers de Telegram (512x512)',
  ImageNotSentOnBotWaitingForImage = 'El mensaje enviado no es una foto valida. Empecemos de nuevo',
  CroppedImageDelivered = 'Acá esta la version recortada del archivo',
  ImageNotSquareWaitingForConfirmation = `Parece que la imagen que mandaste no tiene una relación de aspecto 1:1 ¿Cómo te gustaria continuar?\n
*Opciones disponibles* ⭐ 
/confirmresize -\ confirma la imagen para ajustar el tamaño.   
/resizeimage -\ vuelve a empezar y sube una imagen nueva para ajustar el tamaño.`,
  ImageNotSquareConfirmed = 'Buenisimo, continuemos!',
}

export enum StartMessage {
  Response = 'Hola! 😊 ✨',
}
