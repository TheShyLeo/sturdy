#!/bin/sh

VER='0.0.1'
APP_NAME="sturdy"

if [ $# != 2 ] ; then
    echo 'usage:sh sh build.sh -v x'
    exit
fi
while getopts "v:V:" arg
do
    case $arg in
        v)
            VER=$VER'.'$OPTARG;;
        *)
            echo 'usage:sh build.sh -v x'
            exit;;
    esac
done

rm -rf output
mkdir -p output/apps/$APP_NAME
mkdir -p output/conf/apps/$APP_NAME

cp -rf dao data page aspect output/apps/$APP_NAME/
cp -rf conf/app/* output/conf/apps/$APP_NAME/

ls conf/*/$APP_NAME.js | awk -F '/' '{print "output/conf/up/"$2}' |xargs mkdir -p
ls conf/*/$APP_NAME.js | awk -F '/' '{print $2}' |xargs -I {} cp conf/{}/$APP_NAME.js output/conf/up/{}/

cd output
echo $VER>conf/apps/$APP_NAME/version
tar zcf $APP_NAME-$VER.tar.gz apps conf
rm -rf apps conf
