import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  { ignores: ['node_modules', 'dist'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      eqeqeq: ['error', 'always'],

      /*Настройка правил сортировки импортов.*/
      'simple-import-sort/imports': [
        /*Устанавливаем уровень серьезности правила в ESLint: если импорты будут расположены не по этому правилу, то
        ESLint покажет красную ошибку.*/
        'error',
        {
          /*Создаем одну группу в одном массиве, чтобы избежать пустых строк между группами.*/
          groups: [
            [
              /*1. Side-effect imports, например, 'reflect-metadata' или 'dotenv/config'. "^\\u0000" - это Null-символ,
              который является официальным хаком/трюком. Плагин внутри себя помечает все импорты с побочными эффектами
              этим невидимым символом в начале, что позволяет такие импорты ставить на самый верх.*/
              '^\\u0000',
              /*2. Файлы БД, то есть файлы, которые имеют в пути или имени ".db".*/
              '^.+\\.db(/|$)',
              /*3. Файлы, имеющие отношение к IOC, то есть файлы из папки "src/ioc/". Не будет применяться для файлов
              внутри папки "src/ioc/".*/
              '(^|/)ioc(/|$)',
              /*4. Внешние пакеты, то есть те, которые не начинаются с "." или "/".*/
              '^@?\\w',
              /*5. Guard-middlewares, то есть файлы, которые имеют в имени ".guard-middleware".*/
              '\\.guard-middleware(/|$)',
              /*6. Middlewares, то есть файлы, которые имеют в имени ".middleware" или ".middlewares".*/
              '\\.middlewares?(/|$)',
              /*7. Адаптеры, то есть файлы, которые имеют в имени ".adapter".*/
              '\\.adapter(/|$)',
              /*8. Роутеры, то есть файлы, которые имеют в имени ".router".*/
              '\\.router(/|$)',
              /*9. Контроллеры, то есть файлы, которые имеют в имени ".controller".*/
              '\\.controller(/|$)',
              /*10. Сервисы, то есть файлы, которые имеют в имени ".service".*/
              '(?<!query-)\\.service(/|$)|(?<!\\.query-)service(/|$)',
              /*11. Query-сервисы, то есть файлы, которые имеют в имени ".query-service".*/
              '\\.query-service(/|$)',
              /*12. Репозитории, то есть файлы, которые имеют в имени ".repository".*/
              '(?<!query-)\\.repository(/|$)',
              /*13. Query-репозитории, то есть файлы, которые имеют в имени ".query-repository".*/
              '\\.query-repository(/|$)',
              /*14. Модели Mongoose, то есть файлы, которые имеют в имени ".model".*/
              '\\.model(/|$)',
              /*15. Типы, то есть файлы, которые имеют в имени ".type" или ".d".*/
              '\\.(type|d)(/|$)',
              /*16. Input-DTO, то есть файлы, которые имеют в имени ".input-dto".*/
              '\\.input-dto(/|$)',
              /*17. Output-DTO, то есть файлы, которые имеют в имени ".output-dto".*/
              '\\.output-dto(/|$)',
              /*18. Мапперы, то есть файлы, которые имеют в имени ".util" и начинаются с "map-from".*/
              '/map-from[^/]*\\.util(/|$)',
              /*19. Прочие утилиты, то есть файлы, которые имеют в имени ".util".*/
              '\\.util(/|$)',
              /*20. Тестовые данные, то есть файлы, которые имеют в имени ".test-data".*/
              '\\.test-data(/|$)',
              /*21. Тестовые утилиты, то есть файлы, которые имеют в имени ".test-util".*/
              '\\.test-util(/|$)',
              /*22. Все остальное.*/
              '^',
            ],
          ],
        },
      ],
      /*Дополнительное правило, которое устанавливает правил сортировки экспортов по алфавиту.*/
      'simple-import-sort/exports': 'error',
    },
  },
  prettierConfig,
];
