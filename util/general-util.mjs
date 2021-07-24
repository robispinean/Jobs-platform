import { dirname } from 'path';
import { fileURLToPath } from 'url';

const util = {
  getCurrentDirectoryFromURL: (url) => dirname(fileURLToPath(url)),
};

export default util;
