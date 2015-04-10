#!/bin/sh

#apt-get install jq
#ffprobe -v quiet -print_format json -show_format -show_streams GOPR0207.MP4 |jq '.streams[0].width'

file=./public/media/$1
#file_o='/usr/local/nginx/html/mp4/out'

#v_wi=`ffprobe -v quiet -print_format json -show_format -show_streams ${file} |jq '.streams[0].width'`
#v_he=`ffprobe -v quiet -print_format json -show_format -show_streams ${file} |jq '.streams[0].height'`
#v_as=`ffprobe -v quiet -print_format json -show_format -show_streams ${file} |jq '.streams[0].sample_aspect_ratio'`
#v_di=`ffprobe -v quiet -print_format json -show_format -show_streams ${file} |jq '.streams[0].display_aspect_ratio'`
#v_af=`ffprobe -v quiet -print_format json -show_format -show_streams ${file} |jq '.streams[0].avg_frame_rate'`
#v_rf=`ffprobe -v quiet -print_format json -show_format -show_streams ${file} |jq '.streams[0].r_frame_rate'`
#v_dur=`ffprobe -v quiet -print_format json -show_format -show_streams ${file} | jq '.format.duration'`
#v_fr=`ffprobe -v quiet -print_format json -show_format -show_streams ${file} | jq '.streams[0].nb_frames'`

#echo ${v_wi}
#echo ${v_he}
#echo ${v_dur}
#ls -l ${file}
#exit 0
#sleep 1
ffmpeg -re -i ./public/media/$1 \
    -vcodec libx264 -profile:v high -level 3.1 -g 50 -r 25 -b:v 384k  -b:a 32k   -s 320x180  -acodec libvo_aacenc -ar 44100 -ac 1 -f mp4 ./public/media/$1_320p.mp4 \
    -vcodec libx264 -profile:v high -level 3.1 -g 50 -r 25 -b:v 768k  -b:a 64k   -s 640x360  -acodec libvo_aacenc -ar 44100 -ac 1 -f mp4 ./public/media/$1_640p.mp4 \
    -vcodec libx264 -profile:v high -level 3.1 -g 50 -r 25 -b:v 2048k -b:a 128k -s 1280x720 -acodec libvo_aacenc -ar 44100 -ac 1 -f mp4 ./public/media/$1_720p.mp4 \
    -vcodec libx264 -profile:v high -level 3.1 -g 50 -r 25 -b:v 5120k -b:a 128k -s 1920x1080 -acodec libvo_aacenc -ar 44100 -ac 1 -f mp4 ./public/media/$1_1080p.mp4
# 2>>/tmp/ffmpeg.log; -g 50 -r 25

#ffmpeg -re -i ./public/media/$1 \
#    -vcodec libx264 -vprofile baseline -g 50 -r 25 -b:v 640k  -b:a 64k   -s 640x360  -acodec libvo_aacenc -ar 44100 -ac 1 -f mp4 ./public/media/$1_640pl.mp4

qt-faststart ./public/media/$1_320p.mp4 ./public/media/$1_320pm.mp4 
qt-faststart ./public/media/$1_640p.mp4 ./public/media/$1_640pm.mp4 
qt-faststart ./public/media/$1_720p.mp4 ./public/media/$1_720pm.mp4 
qt-faststart ./public/media/$1_1080p.mp4 ./public/media/$1_1080pm.mp4 

rm ./public/media/$1_320p.mp4 
rm ./public/media/$1_640p.mp4 
rm ./public/media/$1_720p.mp4 
rm ./public/media/$1_1080p.mp4 
