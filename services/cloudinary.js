import cloudinary from 'cloudinary';

import path from "path";
import {config} from "dotenv";
config({path: path.resolve('config/dot.env')});

cloudinary.v2.config({
   cloud_name: "dslddzcda",
   api_key: "249436911435391",
   api_secret: "eseoEwWT86o6WhxssPRjR1lAwlw",
   secure: true,
});
export default cloudinary.v2;