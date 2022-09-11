import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from 'src/app/subreddit/post/post.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private static titleMaxLength: number = 300;

  postCreateForm: FormGroup = new FormGroup({
    'title': new FormControl(null, [
      Validators.required,
      Validators.maxLength(PostCreateComponent.titleMaxLength),
      Validators.pattern('^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\\d\\-!\\$%\\^&\\*\\(\\)_\\+|~=`\\{\\}\\[\\]:";\'<>\\?,\\.\\/ ]+$')
    ]),
    'text': new FormControl(null, [
      Validators.maxLength(10000)
    ]),
    'postImages': new FormArray([
      new FormGroup({
        'title': new FormControl(null),
        'url': new FormControl(null)
      })
    ])
  });
  imageControlsSize = 1;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  createPost() {
    try {
      this.postService.createPost(this.postCreateForm.value['title'], this.postCreateForm.value['text']);
    } catch (error) {
      this.postCreateForm.reset();
    }
  }
  imageChanged() {
    var images = <FormArray>this.postCreateForm.get('postImages');
    // Find empty image groups (title and url) to remove
    var indexToRemove: number[] = [];
    images.controls.forEach((image, index) => {
      var imageGroup = <FormGroup>image;
      var title = <FormControl>imageGroup.controls['title'];
      var url = <FormControl>imageGroup.controls['url'];
      // Check if both Image title and Image URL are empty.
      if ((!title.value || !title.value.trim()) && (!url.value || !url.value.trim())) {
        indexToRemove.push(index);
      }

      // Check if Title is present, but URL is not. URL is required for non-empty Image group.
      if (title.value && (!url.value || !url.value.trim())) {
        url.addValidators(Validators.required);
      } else {
        url.removeValidators(Validators.required);
      }
      url.updateValueAndValidity();
    });
    // Remove all empty image groups found
    if (images.controls.length > 1 && indexToRemove.length > 0) {
      indexToRemove = indexToRemove.sort((a, b) => b - a);
      for (const remove of indexToRemove) {
        images.removeAt(remove);
      }
    }
    // Add new empty group at the end
    images.push(new FormGroup({
      'title': new FormControl(null),
      'url': new FormControl(null)
    }));
  }

  public get postImages(): FormArray {
    return <FormArray>this.postCreateForm.get('postImages');
  }

}
