const writeFile = require('fs').writeFile;
const { Observable } = require('rxjs');

module.exports = function(ctx) {
  const pathDevelop = './src/environments/environment.ts';
  const pathStaging = './src/environments/environment.staging.ts';
  const pathProd = './src/environments/environment.prod.ts';
  
  console.log('process.env', process.env);
  let exec = require('child_process').exec;

  const revision = new Observable(s => {
    exec('git rev-parse --short HEAD',
      function (error, stdout, stderr) {
        if (error !== null) {
            console.log('git error: ' + error + stderr);
        }
        s.next(stdout.toString().trim());
        s.complete();
      });
  });

  revision.subscribe(function(res) {
    console.log({res});
    const envProd = `export const environment = {
      apiUrl: 'https://api.arena.com/',
      production: 'true',
      fileUrl: 'http://cloud.develop.console.soundblock.com/assets/${res}',
      gitSha: '${res}'
    };
    `;
    const envStaging = `export const environment = {
      apiUrl: 'https://staging.api.arena.com/',
      production: 'false',
      fileUrl: 'assets',
      gitSha: '${res}'
    };
    `;
    const envDevelop = `export const environment = {
      apiUrl: 'https://develop.api.arena.com/',
      production: 'false',
      fileUrl: 'assets',
      gitSha: '${res}'
    };
    `;
    writeFile(pathProd, envProd, function (err) {
      if (err) {
          throw console.error(err);
      } else {
        console.log({envProd});
      }
    });
    writeFile(pathStaging, envStaging, function (err) {
      if (err) {
          throw console.error(err);
      } else {
        console.log({envStaging});
      }
    });
    writeFile(pathDevelop, envDevelop, function (err) {
      if (err) {
          throw console.error(err);
      } else {
        console.log({envDevelop});
      }
    });
  })

  
};
