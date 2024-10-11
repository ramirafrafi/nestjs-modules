⬅️ [**Return to modules list**](../../README.md)

# nestjs-casl

## Overview
This library is a NestJS module that wraps [**CASL**](https://casl.js.org/), a powerful JavaScript package for access authorization management.

This module is the NestJS way to integrate CASL, leveraging the usage of NestJS features such as guards, dependency injection and etc..

## Terminology
- **Action:** Describes what user can actually do in the app. Action is a word (usually a verb) which depends on the business logic (e.g., `prolong`, `read`). Very often it will be a list of words from CRUD - `create`, `read`, `update` and `delete`.

- **Subject:** The subject or subject type which you want to check action on. Usually this is a business (or domain) entity (e.g., `Subscription`, `Article`, `User`). The relation between subject and subject type is the same as relation between an object instance and its class.

- **Rule:** A tuple of **[Action, Subject]**, defining a permitted or forbidden action on a subject (e.g., `[delete, Post]`). It is possible to define a permission without subject, which is used in rare cases when an action is absolute and not related to a subject.

- **Policy:** Encapsulates a logic that determines if an action on a subject is allowed or denied, it can be implemented as a function or as a class.

## Documentation

### Defining ability factory
To use CASL, an ability instance that defines declaratively user permissions, this package provides a seamless way by implementing `ICaslAbilityFactory`:
> We define types for the **Action**, **Subject** and **Abilities** as described in CASL docs, as our package does not implement its own abstract types.

```typescript
// app.ability-factory.ts

import { InferSubjects } from '@casl/ability';
import { ICaslAbilityFactory, CanRule, CannotRule } from '@ramirafrafi/nestjs-casl';
import { Post } from './post.entity';

export type AppAction = 'read' | 'create' | 'update' | 'delete';

export type AppSubject = InferSubjects<typeof Post>;

export type AppAbilities = [AppAction, AppSubject];

export class AppAbilityFactory implements ICaslAbilityFactory<AppAbilities> {
    defineAbility(can: CanRule<AppAbilities>, cannot: CannotRule<AppAbilities>): void | Promise<void> {
        can('read', Post);
        cannot(['create', 'update', 'delete'], Post);
    }
}
```

> The functions `can()` and `cannot()` passed as arguments to the `defineAbility()` method are of the core CASL package, [read more about them in the official docs](https://casl.js.org/v5/en/guide/define-rules).

### Setup the module

#### Using `forRoot()`
```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from '@ramirafrafi/nestjs-casl';
import { AppAbilityFactory } from './app.ability-factory';

@Module({
  imports: [
      CaslModule.forRoot({
        global: true, // Import module as global module
        abilityFactory: AppAbilityFactory, // Class of ability factory
      }),
  ],
})
export class AppModule { }
```

We can also pass an instance of `ICaslAbilityFactory` to the module:
```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from '@ramirafrafi/nestjs-casl';
import { AppAbilityFactory } from './app.ability-factory';

@Module({
  imports: [
      CaslModule.forRoot({
        global: true, // Import module as global module
        abilityFactory: new AppAbilityFactory(), // Instance of ability factory
      }),
  ],
})
export class AppModule { }
```

> The ability factory is scoped to **REQUEST**, meaning in each request lifecycle a new instance will be resolved and injected to the sub sequent providers in the request lifecycle.

#### Using `forRootAsync()`
We can also import the module asynchronously, making it possible use other providers:
```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { CaslModule } from '@ramirafrafi/nestjs-casl';
import { AppAbilityFactory } from './app.ability-factory';
import { AppService } from './app.service';

@Module({
  imports: [
      CaslModule.forRootAsync({
        global: true, // Import module as global module
        useFactory: (appService: AppService) {
            // Custom logic..

            return {
                abilityFactory: new AppAbilityFactory(), // Instance of ability factory
            };
        },
        imports: [/* Any necessary imports to inject `AppService` */],
        inject: [AppService],
      }),
  ],
})
export class AppModule { }
```

### Basic usage
To secure a route, we use the `CaslGaurd` guard and `@CaslPermissions()` decorator:
```typescript
// post.controller.ts

import { Controller, Post, UseGuards } from '@nestjs/common';
import { CaslGuard, CaslPermissions } from '@ramirafrafi/nestjs-casl';

@UseGuards(CaslGuard)
@CaslPermissions('manage') // Controller level permissions
@Controller('posts')
export class PostController {
  @UseGuards(CaslGuard)
  @CaslPermissions('create') // Handler level permissions
  @Post()
  create() {
    // Logic to create a post..
  }
}
```

> We can pass multiple permissions to `@CaslPermissions()` as multiple arguments, `CaslGuard` will authorize the action only if all the permissions are allowed.

### Policies

#### Function policies
Policies can be defined as functions, taking as argument the defined ability in the ability factory and return a boolean allowing or denying the action:
```typescript
// upsert-post.policy.ts

import { CaslAbility } from '@ramirafrafi/nestjs-casl';
import { AppAbilities } from './app.ability-factory';

export function upsertPostPolicy(ability: CaslAbility<AppAbilities>): boolean | Promise<boolean> {
  return ability.can(['create', 'update'], 'Post');
}
```

#### Class policies
Policies can be also defined as classes, implementing `ICaslPolicyClass`'s `handle()` method:
```typescript
// upsert-post.policy.ts

import { CaslAbility } from '@ramirafrafi/nestjs-casl';
import { AppAbilities, AppSubject } from './app.ability-factory';

export class UpsertPostPolicy implements ICaslPolicyClass<AppAbilities, AppSubject> {
  handle(ability: CaslAbility<AppAbilities>): Promise<boolean> {
    return ability.can(['create', 'update'], 'Post');
  }
}
```

`ICaslPolicyClass` interface also have an optional method `resolveSubject()`, this methods resolves the object to restrict access on, and returns it to be passed as a second argument in the `handle()` method:
```typescript
// upsert-post.policy.ts

import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CaslAbility } from '@ramirafrafi/nestjs-casl';
import { AppAbilities, AppSubject } from './app.ability-factory';

export class UpdatePostPolicy implements ICaslPolicyClass<AppAbilities, AppSubject> {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
  ) {
    //
  }

  handle(ability: CaslAbility<AppAbilities>, post: Post): Promise<boolean> {
    return ability.can('update', post);
  }

  resolveSubject?(): Promise<Post> {
    return Post.findBy({ id: request.params.postId }); // Resolving post using ID in route params
  }
}
```

#### Applying policies
To apply policies, we use the `@CaslPolicies()` decorator:
```typescript
// post.controller.ts

import { Controller, Post, UseGuards } from '@nestjs/common';
import { CaslGuard, CaslPolicies } from '@ramirafrafi/nestjs-casl';
import { UpdatePostPolicy } from './update-post.policy';

@Controller('posts')
export class PostController {
  @UseGuards(CaslGuard)
  @CaslPolicies(UpdatePostPolicy) // Handler level policies
  @Patch(':postId')
  update(@Param('postId') postId: string) {
    // Logic to update a post..
  }
}
