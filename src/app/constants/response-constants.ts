export enum ChatResponses {
  ChatInit = 'Enviame una imagen sin comprimir que deseas ajustar el tamaño y te la mandare como un archivo .png con el tamaño estándar para los stickers de Telegram (512x512)',
  ImageNotSentOnBotWaitingForImage = 'El mensaje enviado no es una foto valida. Empecemos de nuevo',
  CroppedImageDelivered = 'Acá esta la version recortada del archivo',
  ImageNotSquareWaitingForConfirmation = `Parece que la imagen que mandaste no tiene una relación de aspecto 1:1 ¿Cómo te gustaria continuar?`,
  BotAvailableOptions = `*Opciones disponibles* ⭐ 
/confirmresize -\ confirma la imagen para ajustar el tamaño.   
/resizeimage -\ vuelve a empezar y sube una imagen nueva para ajustar el tamaño.`,
  BotAvailableOptions_v1 = `*Opciones disponibles* ⭐
/start -\ empieza a interactuar con el bot.
/resizeimage -\ vuelve a empezar y sube una imagen nueva para ajustar el tamaño.`,
  BotDefaultResponse = 'No te entendi ¡Probemos con alguno de los siguientes comandos!',
  ImageNotSquareConfirmed = 'Buenisimo, continuemos!',
}

export enum StartMessage {
  Response = 'Hola 👋 Para empezar envia /resizeimage',
}
