import { NgModule } from "@angular/core";
import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { AngularMaterialModule } from '../angular-material.module';


@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [
    ReactiveFormsModule, AngularMaterialModule, CommonModule, AppRoutingModule]
})
export class PostsModule {}
