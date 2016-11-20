#!/bin/sh

TARGET="./v1/js"

echo 'Compiling...'

ROOT="../"

rm "$TARGET/*.js"

uglifyjs "${ROOT}js/framework/game_framework.js" --screw-ie8 --lint --mangle --compress >> "$TARGET/compiled.min.js"

for f in ${ROOT}js/*.js
do
  echo "Compiling ${f}"
  uglifyjs $f -v --screw-ie8 --lint --mangle --compress >> "$TARGET/compiled.min.js"
done

CHECKSUM = md5 $TARGET

echo $CHECKSUM

echo 'Compiled.'