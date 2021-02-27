# Locus
Manage all configuration files in one place.

## commands
```shell
--load // --load prettier/eslint/babel from repo/templates
--list // fetch data from github repo
--scan // scan package.json
--config // choose Locus config
//-- TODO: auth --
--update // update repo
--upload // add new config into repo

```

### load

```shell
locus --load prettier
locus --load https://github.com/akasuv/configurations/blob/master/.prettierrc.json
```

- If the value passed to `--load` is a package name, Locus will do a check
    - If there's a Github repo configured, Locus will try to lookup related package config files from the specific repo, if files found, then it will move to next step, if not found, it will search recommend templates.
    - If Github repo not configured, Locus will search recommend templates and recommend to config a Github repo.
- If the value passed to `--load` is a path(local absolute/relative path or url),  Locus will try to load the file from the path.

## list

```shell
--list
```

- If Github repo is specified, Locus will display all the files from the repo.
    - You can select and load files

### scan

```shell
--scan [path] 
```

- By default Locus will scan `package.json` two fields: `dependencies` and `devDependencies` , the packages without configs will be displayed on the top, the configured will be on the bottom.
