#!/bin/sh

##
# Setup environment variables.
##

# Get input arguments.
export BUILD_ID=$1
export APP_NAME=$2
export RUN_LEVEL=$3

# Basic Info.
export OPT_FNRW="/opt/fnrw"

# Vhost Info.
export VHOST="/var/www/${APP_NAME}"
export DRUPAL_DOCROOT="$VHOST/public_html"
export BUILDS="${VHOST}/builds"
export BUILD="$BUILDS/$BUILD_ID"
export PUBLIC_FILES="/mnt/${APP_NAME}"
export LOG_DIR="/var/log/${APP_NAME}"
export CRON_LOG_DIR="${LOG_DIR}/cron"
export CMFOLDER="professionaldesignations"
export CMTARGZ="${CMFOLDER}.tar.gz"

##
# Load common library.
##
source "${OPT_FNRW}/bin/common.sh"
if [ $? -ne 0 ]; then
  echo "Unable to load common.sh exiting."
  exit 4
fi

###
###
# Local Only Functions.
###
###

ExecApp() {

  ##
  # Setup the logging directories.
  ##
#  PrintCallout "Creating log directories."
#  if [ ! -d $CRON_LOG_DIR ]; then
#    echo "Cron log directories don't exist, creating."
#    mkdir -p $CRON_LOG_DIR
#  fi
#  chown -R apache:apache $LOG_DIR

  ##
  # Setup Drupal root directory.
  ##
  echo "Creating build directory."

  # Remove the build if it's already there.
  if [ -d $BUILD ]; then
    PrintCallout "Build already exists. Deleting it."
    rm -rf $BUILD
  fi

  # Creating the clean directory.
  mkdir -p $BUILD

  # Check that the directory is there.
  if [ ! -d $BUILD ]; then
    PrintCallout "Unable to create build directory."
    exit 7
  fi

  # Unpack Drupal.
  PrintCallout "Unpacking the code from the build."
  cd /tmp/${APP_NAME}/$CMFOLDER
  tar -zxf $CMTARGZ -C $BUILD

  # Move Drupal to the docroot.
  # Must be /. on Redhat 6, / is valid on Mac OSX
  PrintCallout "Copying the APP directory to the latest build folder."
  if [ ! -e $BUILD'/index.html' ]; then
    PrintCallout "Index.html not found in build directory $BUILD/index.html, exiting."
    exit 8
  fi

  #if [ -d $BUILD'/prints/downloads' ] || [ -e $BUILD'/prints/downloads' ]; then
  #  PrintCallout "A prints/downloads folder already exists. Mistakenly checked in I suppose. Removing it before continuing."
  #  rm -rf $BUILD'/prints/downloads'
  #fi

  # Make the link to the files directory.
  #ln -sf "${PUBLIC_FILES}/prints" "${BUILD}/prints/downloads"

  # Verify the link is set.
  #if [ ! -h $BUILD'/downloads' ] || [ ! -h $BUILD'/prints/downloads' ]; then
  #  PrintCallout "Files not symlinked to build correctly, exiting."
  #  exit 10
  #fi

  # Destroy the current build and setup the new one.
  PrintCallout "Removing old docroot. $DRUPAL_DOCROOT"
  rm -rf $DRUPAL_DOCROOT
  # @todo - Check that the folder is actually deleted or exit.
  PrintCallout "Creating new docroot. $BUILD -> $DRUPAL_DOCROOT"
  ln -sf $BUILD $DRUPAL_DOCROOT
  if [ ! -e $DRUPAL_DOCROOT'/index.html' ]; then
    PrintCallout "Drupal not found, exiting."
    exit 11
  fi

  # Change permissions back to the apache user.
  PrintCallout "Changing the owner of the vhost directory to apache user."
  chown -f nginx:nginx $VHOST
  chown -f nginx:nginx $PUBLIC_FILES
  chown -Rf nginx:nginx $DRUPAL_DOCROOT
  chown -Rf nginx:nginx $BUILDS

  # Restart the servers.
  ReloadNginx
  if [ $? -ne 0 ]; then
    PrintCallout "Error reloading Apache, exiting."
    exit 12;
  fi
}


##
# Execute on machine type.
##
case ${MACHINE_TYPE} in
  "fnrw-proxy")
    ExecApp
    ;;
esac
