import * as shell from 'shelljs';
shell.rm('-rf', 'dist/*');
shell.cp('-R', 'src/views', 'dist');


