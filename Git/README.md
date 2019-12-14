Git作为代码管理工具
GitLab 是一个于仓库管理系统
gitHub 是一个面向开源及私有软件项目的托管平台 , git代码仓库托管

工作区: 就当前编辑的项目 
暂存区: 保存add的提交的区域
版本库: 保存commit的提交的区域

git status        查看工作区的状态
# 流程
* git init
* git clone
* git status
* git log 
    * git log --pretty=oneline
* git add 
    * git reset HEAD 撤销
    * git reset --hard HEAD^  回退到上一个commit
* git diff 对比
    * git diff          比较的是工作区和暂存区的差别
    * git diff --cached 比较的是暂存区和版本库的差别
    * git diff HEAD     可以查看工作区和版本库的差别
* git commit -m
    * git commit --verbose 提交长文本
    * git revert 撤销commit提交
* git reset 选择版本
* git rm  都移除 --cached 保留工作区
* git branch 创建分支
* git branch -d 删除分支
* git checkout 切换分支
    * checkout -b 创建并切换
* git merge 合并
    * Git默认执行"快进式合并"（fast-farward merge），会直接将Master分支指向Develop分支。
    * git merge --no-ff develop 取消 "快进式合并" 
* git tag 版本号
    * tag -d 版本号 删除tag
* git pull 
    * 等于git fetch + git merge [git rebase和git fetch](https://blog.csdn.net/xuejianbest/article/details/84856773)
* git reflog 用来记录你的每一次命令
* git push -u --force origin myfeature
    * -u 简单来说使用git push -u origin master以后就可以直接使用不带别的参数的git pull从之前push到的分支来pull。
    * git push命令要加上force参数，因为rebase以后，分支历史改变了，跟远程分支不一定兼容，有可能要强行推送
* git cherry commitID 
    * git cherry-pick可以选择某一个分支中的一个或几个commit(s)来进行操作（操作的对象是commit）。例如，假设我们有个稳定版本的分支，叫v2.0，另外还有个开发版本的分支v3.0，我们不能直接把两个分支合并，这样会导致稳定版本混乱，但是又想增加一个v3.0中的功能到v2.0中，这里就可以使用cherry-pick了。    
    
* git config --system --list 查看系统config
* git config --global  --list 全局

# 添加远程源
* git remote add [name] [url]
* git remote set-url [name] [url]    修改url

# 与主干同步
* git fetch origin
* git rebase origin/master

* git pull [name] [branch]

# Pull Request(Gitlab里面叫做 Merge Request)合并仓库
有一个仓库，叫Repo A。你如果要往里贡献代码，首先要Fork这个Repo，于是在你的Github账号下有了一个Repo A2。然后你在这个A2下工作，Commit，push等。然后你希望原始仓库Repo A合并你的工作，你可以在Github上发起一个Pull Request，意思是请求Repo A的所有者从你的A2合并分支。如果被审核通过并正式合并，这样你就为项目A做贡献了
