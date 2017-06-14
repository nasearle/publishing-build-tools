## TL;DR - How do I use it?

## Full documentation

## What each file does & directory structure

## How it works

## naming! files
#ORRR ><DA>S<DAS<D>AS<D>AS<DAS>F<>AS<F>A<SF><SAF
concepts & codelabs tags in metadata
optional slides link metadata
code will use current config file
config file will also map tag to repos

Tagging Environment?

Link together with readme

finish doc





## dependencies & pre-requisites
if this is your first time using this,
install Node (node --v), run npm install to install required tools (these
  will go in node_packages)

#### Step 0: pull the source repo (this one)

#### Step 1: Add docs to the publishing pipeline
You can use the claat tool to add documents (GDoc's) to our "source" materials.
This is done by using claat add + url
This creates a folder named after the GDoc.
A Gdoc file named "Lab: Auditing with Lighthouse" will generate a folder
named "lab-auditing-with-lighthouse". The folder will contain:
* an index.md file - this is Gdoc text converted into markdown
* an img directory with containing the images present in the Gdoc (they
  are given random hash names, and index.md references them by these names)
* a codelab.json file - this file contains metadata such as the last time
the index.md was updated from Gdocs. The most important aspect of this metadata
file is that it is used to reference the orginal Gdoc.

Once a Gdoc document has been added this way, it does not need to be added
again. From now on we can simple use claat update, which will recursively
search through all of the files in this directory, and update all index.md
files based on the Gdoc that is referenced in the corresponding codelab.json
file.

After you have added a document, move it to the appropriate location in
this repo (e.g. if you pulled down a codelab, move it into the codelabs folder).
TODO - potentially automate this.

(Note that current docs as of XX/XX/XX have already been added)

run ./claat help for claats documenation

#### Step 2. Update the config file
The config.json file is used to determine how documents & code are grouped
into "course packages", and ultimately which of these resources get pushed to
the appropriate repository. For example, looking at config.json, you can see
that the "pwa-2-day" course references X topics. The build/publishing
script will use this config file to copy the code, concepts, slides, and
codelabs for each of those topics, and the push those
contents to a their corresponding repository. e.g., the concepts from
topics X will get pushed to [repo]

If you are adding more content (Gdoc documents like ..) or want to repackage
the existing materials dirrefently (e.g., creating a "1-day" course), then all
you need to do is update the config file (and create the appropriate
repositories if they dont already exist)

#### Step 3. Magic
If you have all the docs (whether you added new ones or not), and you have
updated the config file, the you are ready to build/publish.
run npm start build. this will pull down all the

this is also the step to do if you just want to update all published materials
with the Gdoc sources (since if you arent adding new materials or creating
  new packages, you can skip the previous steps)


TODO generate readme's linking
TODO slides
