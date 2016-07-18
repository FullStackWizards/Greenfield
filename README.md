# Greenfield
This is a repo for MKS-39 students' Greenfield project.

Please see our CONTRIBUTIONS.md if you would like to contribute.

STACK:
————--------------------------------
React -- Node -- Express -- MongoDB

For front-end design : React-Bookstrap

TEAM DEVELOPMENT ROLES
- Full Stack: Ricardo
- API's: Tim 
- Front End / React: Kyhan
- Front End / React: Tony
- CSS: Ashley

# Project Summary
The goal of this project is to create a news website that only displays positive articles. Using the New York Times api we can gather stories dating back to 1851. The data returned from these calls is stored with MongoDB and includes a brief summary of each article among other information. IBM's Watson has an api that analyzes a snippet of text and returns scores from 0-1 based on the existence of 5 emotions: anger, fear, joy, sadness, and disgust. We use these scores as a filter by passing each article summary into Watson and rendering only the ones with a 'joy' score above a certain number (0.3).

NYT - https://developer.nytimes.com/
Watson - http://www.ibm.com/watson/developercloud/tone-analyzer.html

# Backlog
- Backdating
- Add news sources
- Search by keyword
- Add authentication
- Filter for other 4 emotions (display angry articles)

# Details
- Components:
/client/components/App.js: Highest level component, controls mood state which triggers articles to be rendered in ArticleList.js.
/client/components/ArticleList.js: Component that houses all articles to be displayed. Displays when state 'mood' != null.
/client/components/Splash.js: Landing page. Displays when state 'mood' = null.
/client/components/UserControls.js: Component for user interation. Client can select dates to be queried. 

- apiModels:
/server/apiModels/lib/news.js: Model dedicated to connecting with NYT.
/server/apiModels/lib/watson.js: Model dedicated to communicating with Watson api.
/server/apiModels/lib/articles.js: Model dedicated to communicating with MongoDB.
/server/apiModels/articles.js: Houses methods to manipulate database.

- Crontab: 
Three script files in /server/crontab directory. Should be set to run at least once a day, currently being executed manually. /server/crontab/fetchDailyArticles.js: Grabs all articles for current day when run.
/server/crontab/fetchWeeklyArtiles.js: Grabs all articles for current week when run (high potential to surpass api call limit).
/server/crontab/fetchTones.js: Looks for articles in database that hasn't been run through Watson and makes that api call. 

# gitGeneral Workflow

1. Clone down the master directly (do not fork):

  -> git clone masterURL yourdirectory

2. Create a new feature branch from master, If it's a new feature, name the branch "feat#". If it's a bug fix, name the branch "bug#". # should be the associated issue number on the GitHub repo.

  -> git checkout -b feat3  OR  -> git checkout -b bug11

3. Make changes and stage them for a commit to your feature branch.

  -> git add -p

4. Commit changes (see commit message guidelines below)  

  -> git commit -m 'message'

5. Sync up with latest master before pushing to remote feature branch:

  -> git pull --rebase origin master

6. Fix any merge conflicts if necessary.

7. Push changes to remote feature branch:

  -> git push origin feat3

8. Generate pull request:

  -> base: master
  -> compare: feat3

9. Fix any issues highlighted by reviewer if necessary.

10. When everything checks out, reviewer merges pull request to master.

11. When a pull request is merged and closed, delete feat3 branch.



## Detailed Workflow

### Cut a namespaced feature branch from master

Your branch should follow this naming convention:
  - bug#
  - feat#
  - test#
  - doc#
  - refactor#

  Where # associates directly with the issue number in the GitHub repo

These commands will help you do this:

# Creates your branch and brings you there

git checkout -b `your-branch-name`

### Make commits to your feature branch.

Prefix each commit like so
  - (feat) Added a new feature
  - (fix) Fixed inconsistent tests [Fixes #0]
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (doc) ...

Make changes and commits on your branch, and make sure that you
only make changes that are relevant to this branch. If you find
yourself making unrelated changes, make a new branch for those
changes.

#### Commit Message Guidelines

- Commit messages should be written in the present tense; e.g. "Fix continuous
  integration script".
- The first line of your commit message should be a brief summary of what the
  commit changes. Aim for about 70 characters max. Remember: This is a summary,
  not a detailed description of everything that changed.
- If you want to explain the commit in more depth, following the first line should
  be a blank line and then a more detailed description of the commit. This can be
  as detailed as you want, so dig into details here and keep the first line short.

### Rebase upstream changes into your branch

Once you are done making changes, you can begin the process of getting
your code merged into the main repo. Step 1 is to rebase upstream
changes to the master branch into yours by running this command
from your branch:

git pull --rebase origin master


This will continue the rebasing process. Once you are done fixing all
conflicts you should run the existing tests to make sure you didn’t break
anything, then run your new tests (there are new tests, right?) and
make sure they work also.

If rebasing broke anything, fix it, then repeat the above process until
you get here again and nothing is broken and all the tests pass.

### Make a pull request

Make a clear pull request from your fork and branch to the upstream master
branch, detailing exactly what changes you made and what feature this
should add. The clearer your pull request is the faster you can get
your changes incorporated into this repo.

At least one other person MUST give your changes a code review, and once
they are satisfied they will merge your changes into upstream. Alternatively,
they may have some requested changes. You should make more commits to your
branch to fix these, then follow this process again from rebasing onwards.

Note: A pull request will be immediately rejected if there are any conflicts!

Once you get back here, make a comment requesting further review and
someone will look at your code again. If they like it, it will get merged,
else, just repeat again.

Thanks for contributing!

### Guidelines

1. Uphold the current code standard:
    - Keep your code [DRY][].
    - Apply the [boy scout rule][].
    - Follow [STYLE-GUIDE.md](STYLE-GUIDE.md)
1. Run the [tests][] before submitting a pull request.
1. Tests are very, very important. Submit tests if your pull request contains
   new, testable behavior.
1. Your pull request is comprised of a single ([squashed][]) commit.

## Checklist:

This is just to help you organize your process

- [ ] Did I cut my work branch off of master (don't cut new branches from existing feature brances)?
- [ ] Did I follow the correct naming convention for my branch?
- [ ] Is my branch focused on a single main change?
- [ ] Do all of my changes directly relate to this change?
- [ ] Did I rebase the upstream master branch after I finished all my
  work?
- [ ] Did I write a clear pull request message detailing what changes I made?
- [ ] Did I get a code review?
- [ ] Did I make any requested changes from that code review?

If you follow all of these guidelines and make good changes, you should have
no problem getting your changes merged in.

<!-- Links -->
[pull request]: https://help.github.com/articles/using-pull-requests/
[DRY]: http://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[boy scout rule]: http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule
[squashed]: http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html
<!-- A link to your directory of tests on github -->
[tests]: tests/

