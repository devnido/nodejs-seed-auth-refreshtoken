# Seed Auth Api Node.js

![Continuous Integration Workflow](https://github.com/devnido/seed-auth-api-nodejs/workflows/Continuous%20Integration%20Workflow/badge.svg)

## Este proyecto fue creado para utilizar como base en futuros desarrollos que utilicen caracteristicas similares.

Proyecto base que forma parte de otros 2 adicionales para crear un sistema en conjunto. El código del repositorio actual es el back-end que sirve para levantar un servidor de autenticación el cual tiene como función principal validar y/o restringir el acceso de los usuarios al [servidor de fuente de datos](https://github.com/devnido/seed-resource-api-nodejs) mediante el uso de tokens de acceso (json web token y refresh token). Adicionalmente se puede integrar con este [panel de administración](https://github.com/devnido/seed-admin-panel-angular)

## Descripción

Está desarrollado en [Node.js](https://nodejs.org/es/) versión v12.13.0 y [mongoDB](https://www.mongodb.com/es) versión v4.2.1

## Uso 

1. Para ejecutar este código no es necesario ejecutar previamente los otros dos proyectos back-end y front-end, pero se recomienda utilizarlos para entender mejor su funcionamiento. [servidor de fuente de datos](https://github.com/devnido/seed-resource-api-nodejs) y [panel de administración](https://github.com/devnido/seed-admin-panel-angular). 

2. Descarga el código en tu computador.

3. Una vez descargado navega hasta la carpeta del proyecto  y luego instala las dependencias `npm install`.

4. Antes de ejecutar el código crea una copia del archivo **.env.example** ubicado en la carpeta raíz del proyecto y renombralo así **.env** para despues abrirlo y modificar los parametros según la configuración de tu entorno de desarrollo.

5. Debes tener el servicio de mongoDB corriendo en tu entorno `mongod`.

6. Para ejecutar el código puedes usar `npm run dev` para que se ejecute con nodemon

## Tests

El directiorio **/test** contiene integration tests y unit tests cada uno en su respectiva carpeta.

Para ejecutar integration test es necesario tener el servicio de mongodb funcionando `mongod`

Las variables para el entorno de testing estan definidas en el archivo **.env.testing** el cual es necesario para los test de integración

Para ejecutar unit test `npm run test:unit`

Para ejecutar integration tests `npm run test:api`

Para ejecutar todos los tests `npm test`


## Funcionalidades implementadas 

1. Registro de usuarios.
2. Ingreso de usuarios.
3. Recuperar contraseña mediante email.
4. Actualización de json web token caducado utilizando un refresh token.
5. Validaciones de autenticación con reCaptcha.

## Documentación de la API 

#### Proximamente...