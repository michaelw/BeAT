echo "Reading logs in !"
export DJANGO_SETTINGS_MODULE=beat.settings
if [ ! -z $1 ]
then
	python filereader.py --verbose --dulwich $* #> log1.txt~
fi
echo "done!"
