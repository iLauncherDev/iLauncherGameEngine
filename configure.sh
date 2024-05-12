#!/bin/bash

RECONFIG="0"
BUILD="0"

for arg in "$@"
do
    shift
    if [ "$arg" == "-build" ]; then
        BUILD="1"
    fi
    if [ "$arg" == "-reconfigure" ]; then
        RECONFIG="1"
    fi
done

if [ "$RECONFIG" == "1" ]; then
    rm -rf output
fi
cmake -B output -S Engine
if [ "$BUILD" == "1" ]; then
    cmake --build output
fi