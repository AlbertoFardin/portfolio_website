#!/bin/bash
# suppongo di trovarmi nella root del progetto che usa la libreria da cui dipende

CURRENT_PRJ="/Volumes/repo/warda-products-ui/brand-go-ui"
NOME_LIBRERIA="@warda/library-ui"
FOLDER_LIBRERIA="/Volumes/repo/warda-products-ui/library-ui"
# ad esempio:
# CURRENT_PRJ="/Volumes/repo/warda-products-ui/brand-go-ui"
# NOME_LIBRERIA="@warda/dev-dependencies-ui"
# FOLDER_LIBRERIA="/Volumes/repo/warda-products-ui/dev-dependencies-ui"

# ricavo il nome del package tgz delle libreria
senzaChiocciola=${NOME_LIBRERIA/@/}
NOME_TGZ=${senzaChiocciola/\//-}

echo ${NOME_TGZ}
cd ${FOLDER_LIBRERIA}
npm run dist:build
cd ./package
npm pack
cp $NOME_TGZ* ${CURRENT_PRJ}
cd ${CURRENT_PRJ}
npm uninstall ${NOME_LIBRERIA}
npm install -D $NOME_TGZ*
rm $CURRENT_PRJ*.tgz