#!/bin/bash

function pull_gdocs {
  ./claat update
  npm install
  node codeLabHelper.js
}

pull_gdocs

function build_packages {
  "1-day 3-day 5-day semester"

}

# function generate_test_source_files {
#   TEAMS="web android"
#   MODULES="analytics database messaging accessibility security"
#   COMPONENTS="code lab concept slides"
#   LANGUAGES="english hindi spanish"
#
#   echo "generating test source files..."
#
#   for team in $TEAMS; do
#     echo generating $team/
#     mkdir $team
#     cd $team
#
#     for language in $LANGUAGES; do
#       mkdir $language
#       cd $language
#
#       for module in $MODULES; do
#         mkdir $module
#         cd $module
#
#         for component in $COMPONENTS; do
#           mkdir $component
#           cd $component
#
#           if [ $component = "code" ]; then
#             mkdir app
#             touch app/app-code.js
#             touch app/app-code.html
#             mkdir solution
#             touch solution/solution-code.js
#             touch solution/solution-code.html
#
#           elif [ $component = "concept" ]; then
#               touch concept-$module.md
#
#           elif [ $component = "lab" ]; then
#             touch lab-$module.md
#
#           elif [ $component = "slides" ]; then
#             touch slides-$module.md
#
#           else
#             echo unexpected component, skipping
#           fi
#
#           cd ..
#         done
#
#         cd ..
#       done
#
#       cd ..
#     done
#
#     cd ..
#   done
#
#   echo "finished generating test source files."
# }

function build {
  # usage build name team language modules...
  COMPONENTS="code lab concept slides"
  NAME=$1
  TEAM=$2
  LANGUAGE=$3
  MODULES=$*
  DEST=build/$TEAM/$LANGUAGE/$NAME

  mkdir -p $DEST

  shift; shift; shift;
  for module in $*; do
    for component in $COMPONENTS; do
      mkdir -p $DEST/$module
      if [ $component = "concept" ]; then
        cp -r $TEAM/$module/$component/$LANGUAGE $DEST/$module/concept
      else
        cp -r $TEAM/$module/$component $DEST/$module/
      fi
    done
  done

  exit
}

# OPTIONS="quit generate_test_files build_example"
# select opt in $OPTIONS; do
#   if [ "$opt" = "quit" ]; then
#    echo quitting
#    exit
#  elif [ "$opt" = "build_example" ]; then
#     build 3-day-course web german analytics accessibility battery
#   else
#    echo invalid option
#   fi
# done
