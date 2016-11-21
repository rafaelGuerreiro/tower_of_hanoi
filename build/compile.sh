#!/bin/sh

TARGET="./v1"

echo 'Compiling...'

ROOT=".."

for f in $TARGET/js/*.js $TARGET/css/*.css
do
  rm $f
done

FILES="$ROOT/js/game_framework.js
$ROOT/js/game_setup.js
$ROOT/js/game_controller.js
$ROOT/js/time.js
$ROOT/js/move.js
$ROOT/js/user_plays.js
$ROOT/js/computer_plays.js"

for f in $FILES
do
  echo "Compiling JS: ${f}"
  uglifyjs $f --screw-ie8 --lint --mangle --compress >> "$TARGET/js/compiled.min.js"
done

JSCHECKSUM=`md5 -q "$TARGET/js/compiled.min.js"`
mv "$TARGET/js/compiled.min.js" "$TARGET/js/compiled.$JSCHECKSUM.min.js"

echo "Compiled: $TARGET/js/compiled.$JSCHECKSUM.min.js"

FILES="$ROOT/css/game_style.css"
for f in $FILES
do
  echo "Compiling CSS: ${f}"
  uglifycss $f >> "$TARGET/css/compiled.min.css"
done

CSSCHECKSUM=`md5 -q "$TARGET/css/compiled.min.css"`
mv "$TARGET/css/compiled.min.css" "$TARGET/css/compiled.$CSSCHECKSUM.min.css"

echo "Compiled: $TARGET/css/compiled.$CSSCHECKSUM.min.css"

sed s/\{min\.js\}/"js\\/compiled\\.$JSCHECKSUM\\.min\\.js"/g template.html > "$TARGET/index_temp.html"
sed s/\{min\.css\}/"css\\/compiled\\.$CSSCHECKSUM\\.min\\.css"/g "$TARGET/index_temp.html" > "$TARGET/index.html"

rm "$TARGET/index_temp.html"

cp -Rf v1/ ../../cpsc1045-tower-of-hanoi

cd ../../cpsc1045-tower-of-hanoi
git add -A
git commit -m "Build #$JSCHECKSUM"

git push heroku master

echo 'Compiled.'