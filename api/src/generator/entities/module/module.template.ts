interface ModuleTemplate {
  imports: string[];
  controllers: string[];
  providers: string[];
  name: string;
}

const nestModule = `@Module({
    imports: [
        {#each imports}
        {{{this}}},
        {/each}
    ],
    controllers: [
        {#each controllers}
        {{{this}}},
        {/each}
    ],
    providers: [
        {#each providers}
        {{{this}}},
        {/each}
    ],
})
export class {{name}} {}`;

export const moduleTemplate = Handlebars.compile<ModuleTemplate>(nestModule);
