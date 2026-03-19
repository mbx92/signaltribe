<template>
  <div>
    <div id="swagger-ui"></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'API Docs — SignalTribe',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
    },
  ],
  script: [
    {
      src: 'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
      defer: true,
    },
  ],
  style: [
    {
      innerHTML: `
        body { margin: 0; }
        .swagger-ui .topbar { background-color: oklch(30.6% 0.084 153); }
        .swagger-ui .topbar .download-url-wrapper .select-label select,
        .swagger-ui .topbar .download-url-wrapper input[type=text] {
          border: 2px solid rgba(255,255,255,0.3);
        }
        .swagger-ui .info .title { color: oklch(30.6% 0.084 153); }
        .swagger-ui .btn.authorize { border-color: oklch(30.6% 0.084 153); color: oklch(30.6% 0.084 153); }
        .swagger-ui .btn.authorize svg { fill: oklch(30.6% 0.084 153); }
        .swagger-ui section.models { display: none; }
      `,
    },
  ],
})

onMounted(() => {
  const init = () => {
    const SwaggerUIBundle = (window as any).SwaggerUIBundle
    if (!SwaggerUIBundle) {
      setTimeout(init, 100)
      return
    }
    SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      deepLinking: true,
      tryItOutEnabled: true,
      persistAuthorization: true,
      displayRequestDuration: true,
      defaultModelsExpandDepth: -1,
      tagsSorter: 'alpha',
    })
  }
  init()
})
</script>
