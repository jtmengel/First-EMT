#!/usr/bin/python

import os,glob
from subprocess import call
   
path = './'
for vid in glob.glob( os.path.join(path, '*.mp4') ):
	call(['ffmpeg','-i',vid, vid[0:-4] + '.webm'])
	call(['ffmpeg2theora', vid])    
