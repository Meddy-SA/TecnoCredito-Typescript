<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

const showTerminos = ref(false);
const showPolitica = ref(false);
</script>

<template>
  <div>
    <footer
      class="flex flex-col gap-2 sm:justify-between sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-800 dark:border-gray-700">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        @ 2024 Tecno Ahorro. Todos los Derechos Reservados.
      </p>
      <nav clas="sm:ml-auto flex gap-4 sm:gap-6">
        <Button label="Términos de Servicios" link pt:label:class="text-xs" @click="showTerminos = true" />
        <Button label="Política de Privacidad" link pt:label:class="text-xs" @click="showPolitica = true" />
      </nav>
    </footer>
    <Dialog v-model:visible="showTerminos" modal header="Términos de Servicios" :style="{ width: '50rem' }">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
        <h1 class="text-3xl font-bold text-center mb-6">
          Términos de Servicio
        </h1>

        <section class="mb-8">
          <h2 class="text-xl dark:text-gray-300 font-semibold mb-2">
            1. Aceptación de los términos
          </h2>
          <p class="text-gray-700 dark:text-gray-400">
            Al acceder y utilizar este sitio web, usted acepta cumplir y estar
            sujeto a los siguientes términos de servicio. Si no está de acuerdo
            con estos términos, por favor, no utilice este sitio web.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl dark:text-gray-300 font-semibold mb-2">
            2. Modificaciones
          </h2>
          <p class="text-gray-700 dark:text-gray-400">
            Nos reservamos el derecho de modificar o reemplazar estos términos
            en cualquier momento. Es su responsabilidad revisar periódicamente
            esta página para estar al tanto de cualquier cambio. El uso
            continuado de nuestro sitio web después de cualquier modificación
            constituye su aceptación de los nuevos términos.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl dark:text-gray-300 font-semibold mb-2">
            3. Uso del sitio
          </h2>
          <p class="text-gray-700 dark:text-gray-400">
            Usted acepta utilizar este sitio web solo para fines legales y de
            acuerdo con estos términos. Queda estrictamente prohibido el uso del
            sitio para cualquier actividad ilegal, que infrinja los derechos de
            otros o que dañe el funcionamiento del sitio.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl dark:text-gray-300 font-semibold mb-2">
            4. Propiedad intelectual
          </h2>
          <p class="text-gray-700 dark:text-gray-400">
            Todo el contenido de este sitio, incluidos textos, gráficos,
            logotipos, imágenes y software, es propiedad nuestra o de nuestros
            licenciantes y está protegido por las leyes de propiedad
            intelectual. Usted no puede reproducir, distribuir ni utilizar
            nuestro contenido sin nuestro permiso expreso por escrito.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl dark:text-gray-300 font-semibold mb-2">
            5. Limitación de responsabilidad
          </h2>
          <p class="text-gray-700 dark:text-gray-400">
            En ningún caso seremos responsables por cualquier daño directo,
            indirecto, incidental, especial o consecuente que surja del uso o la
            imposibilidad de utilizar este sitio web o sus contenidos. No
            garantizamos que el sitio funcione sin interrupciones ni errores.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl dark:text-gray-300 font-semibold mb-2">
            6. Enlaces a terceros
          </h2>
          <p class="text-gray-700 dark:text-gray-400">
            Este sitio web puede contener enlaces a sitios de terceros. No somos
            responsables del contenido ni de las prácticas de privacidad de esos
            sitios. Recomendamos revisar los términos y políticas de cualquier
            sitio de terceros que visite.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl dark:text-gray-300 font-semibold mb-2">
            7. Terminación
          </h2>
          <p class="text-gray-700 dark:text-gray-400">
            Nos reservamos el derecho de suspender o terminar su acceso a
            nuestro sitio web, sin previo aviso, si usted viola estos términos.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl dark:text-gray-300 font-semibold mb-2">
            8. Ley aplicable
          </h2>
          <p class="text-gray-700 dark:text-gray-400">
            Estos términos se regirán e interpretarán de acuerdo con las leyes
            de la jurisdicción donde nuestra empresa tiene su sede, sin tener en
            cuenta los conflictos de disposiciones legales.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl dark:text-gray-300 font-semibold mb-2">
            9. Contacto
          </h2>
          <p class="text-gray-700 dark:text-gray-400">
            Si tiene alguna pregunta sobre estos términos de servicio, por favor
            contáctenos en:
            <a href="mailto:contacto@tecnoahorro.com"
              class="text-indigo-600 hover:underline">contacto@tecnoahorro.com</a>.
          </p>
        </section>

        <footer class="text-center text-gray-500 text-sm mt-8">
          &copy; 2024 Tecno Ahorro. Todos los derechos reservados.
        </footer>
      </div>
    </Dialog>
    <Dialog v-model:visible="showPolitica" modal header="Política de Privacidad" :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <div class="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-10">
        <h1 class="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          Políticas de Privacidad
        </h1>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            1. Información que recopilamos
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            En Tecno Ahorro, respetamos su privacidad y estamos comprometidos a
            proteger la información personal que usted comparte con nosotros.
            Podemos recopilar información personal, como su nombre, dirección de
            correo electrónico y otros detalles que usted proporciona
            voluntariamente cuando utiliza nuestro sitio web.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            2. Uso de la información
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            Utilizamos la información recopilada para mejorar nuestros
            servicios, responder a sus consultas y enviarle actualizaciones
            sobre nuestros productos y promociones. No compartiremos ni
            venderemos su información personal a terceros sin su consentimiento,
            excepto en los casos requeridos por la ley.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            3. Protección de su información
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            Tecno Ahorro adopta medidas de seguridad para proteger su
            información personal contra el acceso no autorizado, la alteración o
            la destrucción. Sin embargo, no podemos garantizar una seguridad
            absoluta debido a la naturaleza de Internet.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            4. Cookies
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            Nuestro sitio web utiliza cookies para mejorar su experiencia de
            usuario. Las cookies son pequeños archivos de texto que se almacenan
            en su navegador y nos ayudan a entender cómo interactúa con nuestro
            sitio. Puede desactivar las cookies en su navegador, pero esto
            podría afectar la funcionalidad del sitio.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            5. Enlaces a sitios de terceros
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            Nuestro sitio web puede contener enlaces a sitios web de terceros.
            Tecno Ahorro no es responsable de las prácticas de privacidad o el
            contenido de estos sitios. Le recomendamos que revise las políticas
            de privacidad de cada sitio web que visite.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            6. Modificaciones a la política
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            Tecno Ahorro se reserva el derecho de modificar esta Política de
            Privacidad en cualquier momento. Los cambios se publicarán en esta
            página, y es su responsabilidad revisarla periódicamente. Su uso
            continuado del sitio web después de cualquier cambio constituye su
            aceptación de los nuevos términos.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
            7. Contacto
          </h2>
          <p class="text-gray-700 dark:text-gray-300">
            Si tiene alguna pregunta sobre esta Política de Privacidad, no dude
            en ponerse en contacto con nosotros en:
            <a href="mailto:privacidad@tecnoahorro.com"
              class="text-indigo-600 hover:underline dark:text-indigo-400">privacidad@tecnoahorro.com</a>.
          </p>
        </section>

        <footer class="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          &copy; 2024 Tecno Ahorro. Todos los derechos reservados.
        </footer>
      </div>
    </Dialog>
  </div>
</template>
