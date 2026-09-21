const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== ComixFlix -> Build Estático para GitHub Pages ===');

const apiPath = path.resolve('app/api');
const tempApiPath = path.resolve('app/_api_backup');
let apiMoved = false;

try {
  // 1. Garante que public/data/scraped-catalog.json está atualizado
  console.log('1. Sincronizando catálogo estático em public/data...');
  fs.mkdirSync(path.resolve('public/data'), { recursive: true });
  fs.copyFileSync(path.resolve('lib/data/scraped-catalog.json'), path.resolve('public/data/scraped-catalog.json'));

  // 2. Temporariamente isola app/api para exportação estática pura
  if (fs.existsSync(apiPath)) {
    console.log('2. Isolando rotas dinâmicas de servidor para static export...');
    fs.renameSync(apiPath, tempApiPath);
    apiMoved = true;
  }

  // 3. Executa next build em modo estático
  console.log('3. Executando next build com output: export...');
  execSync('npx next build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      GITHUB_PAGES: 'true',
      NEXT_PUBLIC_BASE_PATH: '/antigravity.comixFlix',
    },
  });

  // 4. Copia .nojekyll e 404.html para a pasta out/
  console.log('4. Configurando .nojekyll e 404.html na pasta out...');
  fs.writeFileSync(path.resolve('out/.nojekyll'), '# disable jekyll\n', 'utf8');
  if (fs.existsSync(path.resolve('public/404.html'))) {
    fs.copyFileSync(path.resolve('public/404.html'), path.resolve('out/404.html'));
  }

  console.log('\n🎉 SUCESSO! Build estático gerado com êxito na pasta /out para GitHub Pages!');
} catch (error) {
  console.error('\n❌ Erro durante o build para GitHub Pages:', error.message);
  process.exit(1);
} finally {
  // Sempre restaura app/api
  if (apiMoved && fs.existsSync(tempApiPath)) {
    console.log('Restaurando rotas de API...');
    fs.renameSync(tempApiPath, apiPath);
  }
}
