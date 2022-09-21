import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PostImage } from 'src/app/subreddit/post/post-image';
import { PostService } from 'src/app/subreddit/post/post.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private static titleMaxLength: number = 300;

  postCreateForm: FormGroup<{ title: FormControl<string | null>, text: FormControl<string | null>, postImages: FormArray<FormGroup<{ title: FormControl<string | null>, url: FormControl<string | null> }>> }> = new FormGroup<{ title: FormControl<string | null>, text: FormControl<string | null>, postImages: FormArray<FormGroup<{ title: FormControl<string | null>, url: FormControl<string | null> }>> }>({
    'title': new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(PostCreateComponent.titleMaxLength),
      Validators.pattern('^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\\d\\-!\\$%\\^&\\*\\(\\)_\\+|~=`\\{\\}\\[\\]:";\'<>\\?,\\.\\/ ]+$')
    ]),
    'text': new FormControl<string | null>(null, [
      Validators.maxLength(10000)
    ]),
    'postImages': new FormArray<FormGroup<{ title: FormControl<string | null>, url: FormControl<string | null> }>>([
      new FormGroup<{ title: FormControl<string | null>, url: FormControl<string | null> }>({
        'title': new FormControl<string | null>(null),
        'url': new FormControl<string | null>(null)
      })
    ])
  });
  imageControlsSize = 1;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  createPost() {
    // try {
    const title = this.postCreateForm.value['title'];
    const text = this.postCreateForm.value['text'];
    var images: PostImage[] = [];
    var imagesControls = <FormArray>this.postCreateForm.get('postImages');
    imagesControls.controls.forEach((image, index) => {
      var imageGroup = <FormGroup>image;
      var title = <FormControl>imageGroup.controls['title'];
      var url = <FormControl>imageGroup.controls['url'];
      images.push(new PostImage(url.value, title.value));
    });
    if (title) {
      this.postService.createPost(title, text ? text : '', images);
      console.log('Creating...');
    }
    // } catch (error) {
    // this.postCreateForm.reset();
    // console.log('Resetting...');
    // }
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
