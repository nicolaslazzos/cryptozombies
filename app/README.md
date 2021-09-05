# CryptoZombies

## To Implement

 - Implementa dunciones para attack, changeName, changeDna, y las funciones ERC721 transfer, ownerOf, balanceOf, etc. La implementación de estas funciones sería idéntica a todas las demás transacciones send que cubrimos.

 - Implementa una "página admin" donde puedas ejecutar setKittyContractAddress, setLevelUpFee, y withdraw. Otra vez, no hay una lógica especial en el front-end aquí — estas implementaciones serían idénticas a las funciones que ya hemos cubierto. Solamente deberías asegurarte de haberlas llamado desde le misma dirección de Ethereum que implementamos en el contrato, ya que tienen el modificador onlyOwner.

 - Hay algunas vistas diferentes en la aplicación que queremos implementar:

    - Una página zombie individual, donde puedes ver información sobre un zombie específico con un enlace permanente a él. Esta página mostraría la apariencia del zombi, mostraría su nombre, su dueño (con un enlace a la página de perfil del usuario), su recuento de victorias/derrotas, su historial de batalla, etc.

    - Una página de usuario, donde puedes ver el ejército zombie de un usuario con un enlace permanente. Podrías hacer clic en un zombie individual para ver su página, y también hacer clic en un zombie para atacarlo si estás conectado a MetaMask y tienes un ejército.

    - Una página de inicio, que es una variación de la página de usuario que muestra el ejército zombie del usuario actual. (Esta es la página que comenzamos a implementar en index.html).

 - Algún método en la interfaz de usuario que permite al usuario alimentarse de CryptoKitties. Podríamos tener un botón por cada zombie en la página de inicio que diga "Feed Me", a continuación, un cuadro de texto que solicite al usuario ingresar la identificación de un "kitty" (o una URL a ese "kitty", ejemplo; https://www.cryptokitties.co/kitty/578397). Esto dispararía nuestra función feedOnKitty.

 - Algún método en la interfaz de usuario (UI) para que el usuario ataque al zombi de otro usuario. Una forma de implementar esto sería cuando el usuario esté navegando en la página de otro usuario, podría haber un botón que dijera "Atacar a este zombi". Cuando el usuario hiciera clic en él, aparecería un modal que contiene el ejército zombie del usuario actual y le indicara: "¿Con qué zombi te gustaría atacar?" La página de inicio del usuario también podría tener un botón por cada uno de sus zombies que dijera "Atacar a un zombi".. Cuando se hiciera clic, podría aparecer un modal con un campo de búsqueda donde podrían escribir el ID de un zombie para buscarlo. O una opción diciendo "Atacar a un zombi random", que buscaría un número aleatorio para él. También quisiéramos oscurecer a los zombis del usuario cuyo período de enfriamiento aún no haya pasado, para que la IU pueda indicar al usuario que aún no puede atacar con ese zombi, y cuánto tiempo tendrá que esperar.
 - La página de inicio del usuario también tendría opciones para cambiar el nombre, cambiar el ADN y subir de nivel de cada zombi (por una tarifa). Las opciones se atenuarán si el usuario aún no tiene el nivel suficiente.
 - Para los nuevos usuarios, debemos mostrar un mensaje de bienvenida con un mensaje para crear el primer zombie en su ejército, que llama a createRandomZombie ().
 - Probablemente querríamos agregar un evento Attack a nuestro contrato inteligente con ladirección del usuario como una propiedad indexed, como se discutió en el último capítulo. Esto nos permitiría crear notificaciones en tiempo real — podríamos mostrar al usuario una alerta emergente cuando uno de sus zombies fue atacado, para que pudieran ver al usuario/zombie que los atacó y tomar represalias.
 - Probablemente también querríamos implementar algún tipo de capa de caché frontal, por lo que no siempre estamos volviendo loco a Infura con solicitudes de la misma información. (Nuestra implementación actual de displayZombies llama agetZombieDetails para cada zombie cada vez que actualizamos la interfaz — pero, en realidad, solo tenemos que llamar a estas funciones al nuevo zombie que se ha agregado a nuestro ejército).
 - Una sala de chat en tiempo real para que puedas hablar mal de otros jugadores mientras aplastas a su ejército zombi :P Eso es solo un comienzo — Estoy seguro de que podríamos encontrar aún más características — y ya es una lista masiva. Dado que hay un montón de código de front-end que entraría en la creación de una interfaz completa como esta (HTML, CSS, JavaScript y un framework tipo React o Vue.js), construir todo este front-end probablemente sea un curso completo con 10 lecciones en sí mismo. Así que te dejamos la impresionante implementación para ti.
