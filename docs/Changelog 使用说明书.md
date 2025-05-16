# 📘 Changelog 使用说明书

本项目已集成自动化 Changelog 管理工具（基于 Conventional Commits、Commitizen 和 Standard Version），用于规范提交记录并自动生成 `CHANGELOG.md` 文件。

---

## 📦 安装依赖（已完成）

本项目已安装以下依赖：

- `commitizen`
- `cz-conventional-changelog`
- `standard-version`

---

## 🧩 提交规范（Conventional Commits）

请使用以下格式进行提交：

```
<type>(<scope>): <subject>
```

### 常用类型（type）：

| 类型     | 说明                         |
| -------- | ---------------------------- |
| feat     | 新功能                       |
| fix      | Bug 修复                     |
| docs     | 文档更新                     |
| style    | 代码格式（不影响功能）       |
| refactor | 代码重构（非新增/修复功能）  |
| test     | 添加或修改测试               |
| chore    | 杂项（构建流程、依赖管理等） |

### 示例：

```bash
feat(login): 添加用户登录页面
fix(api): 修复请求头缺失的问题
docs: 更新使用说明文档
```

---

## 📦 生成 Changelog 和发布版本

使用 `standard-version` 可以根据提交自动生成 `CHANGELOG.md` 并更新版本号。

### 🔹 第一次发布（初始化）

```bash
pnpm release --first-release
```

### 🔹 常规发布（自动根据提交生成版本号）

```bash
pnpm release
```

### 🔹 手动指定版本类型

```bash
pnpm release:patch   # 补丁版本，例如 1.0.1
pnpm release:minor   # 小版本，例如 1.1.0
pnpm release:major   # 大版本，例如 2.0.0
```

执行后会自动完成以下操作：

1. 读取 Git 提交记录
2. 更新 `CHANGELOG.md`
3. 更新 `package.json` 和 `package-lock.json`（如有）
4. 提交变更并创建 Git tag

---

## 🚀 推送变更

发布完成后，请将生成的变更和 tag 推送到主分支：

```bash
git push --follow-tags origin main
```

---

## 📄 示例文件说明

| 文件名         | 说明                  |
| -------------- | --------------------- |
| `CHANGELOG.md` | 自动生成的变更日志    |
| `package.json` | 包含 release 脚本配置 |

---

## 📌 注意事项

- 请始终使用 `pnpm dlx cz` 提交代码，避免使用 `git commit`。
- 所有重要变更应写入合适的提交类型，以便正确生成 changelog。
- 若未正确遵守提交规范，`standard-version` 可能无法识别并生成日志。

---

## ✅ 快速命令参考

| 操作             | 命令                                 |
| ---------------- | ------------------------------------ |
| 提交代码         | `pnpm dlx cz`                        |
| 生成 changelog   | `pnpm release`                       |
| 初始化 changelog | `pnpm release --first-release`       |
| 推送变更         | `git push --follow-tags origin main` |

---

如需更多帮助，请参考：

- [Conventional Commits 官网](https://www.conventionalcommits.org)
- [Standard Version 文档](https://github.com/conventional-changelog/standard-version)
