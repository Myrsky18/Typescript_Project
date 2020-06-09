const path = require("path");

const config = {
  devtool: 'source-map',
    entry: './src/script/KanbanBoard.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                         
                  "style-loader",
                  
                  "css-loader",
                  
                  "sass-loader"
                ]
              },
        ],
    },
    
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    }
};
module.exports = config;

