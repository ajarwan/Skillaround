import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, forwardRef, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from 'src/app/core/core.base';
import { CoreHelper } from 'src/app/core/services/core.helper';
import { AppEnums } from 'src/app/app.enums';
import { environment } from 'src/environments/environment';
import { CoreEnums } from 'src/app/core/core.enums';

declare var tinymce: any;
declare var jQuery: any;


@Component({
  selector: 'shared-richtextbox',
  templateUrl: './richtextbox.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextbox),
      multi: true
    }
  ]
})
export class RichTextbox extends BaseComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {

  /*****************************
  *      Properties
  *****************************/
  public GeneratedHTML: string;

  public Editor: any;

  public UniqeId: any = CoreHelper.NewGuid();

  public Direction = 'ltr';

  public ToolBarsToShow: string = 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image';

  //public MenuBarsToShow = 'file edit insert view format table';
  public MenuBarsToShow = 'edit insert view format table';

  @Input() Height = 500;

  @Input() IsDisabled = false;

  @Input() set IsArabic(val: boolean) {
    this.Direction = val ? 'rtl' : 'ltr';
    this.Init();
  }

  @Input() set ToolBar(val: any[]) { // [AppEnums.RichTextboxToolBar.Bullist ,'|', AppEnums.RichTextboxToolBar.---]

    let items: string[] = [];

    val.forEach((x: any) => {

      if (x == '|') {
        items.push('|');
        return;
      }
      items.push(AppEnums.RichTextboxToolBar[x].toLowerCase());

    });

    this.ToolBarsToShow = items.join(',');
  }

  @Input() set MenuBar(val: any[]) {

    let items: string[] = [];

    val.forEach((x: any) => {

      if (x == '|') {
        items.push('|');
        return;
      }
      items.push(AppEnums.RichTextboxMenulBar[x].toLowerCase());

    });


    this.MenuBarsToShow = val.join(',');
  }


  /*****************************
*      Constructor
*****************************/
  constructor() {
    super();
  }

  /*****************************
  *      Implementations
  *****************************/
  public ngOnInit() {
    if (this.IsArabic) {
      this.Direction = 'rtl';
    }

  }
  public ngAfterViewInit() {

    this.Init();
  }

  public ngOnDestroy() {
    console.log('destroy tinymce')
    tinymce.remove(this.Editor);
  }


  /*****************************
   *      Methods
   *****************************/
  propagateChange = (_: any) => { };

  writeValue(value: string) {

    //debugger;
    if (value == null) {
      value = '';
      this.GeneratedHTML = '';
    }
    this.GeneratedHTML = value;
    this.propagateChange(this.GeneratedHTML);

    if (this.Editor) {
      //console.log(this.GeneratedHTML);


      this.Editor.setContent(this.GeneratedHTML);

      setTimeout(() => {
        this.Editor.setContent(this.GeneratedHTML);
      }, 1000)

    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {

  }

  Init() {
    // toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
    // menubar: 'file edit insert view format table',

    if (this.Editor != null) {
      tinymce.remove(this.Editor);
    }

    let me = this;
    tinymce.init({
      //width: 600,
      height: 300,
      selector: '#' + this.UniqeId,
      readonly: this.IsDisabled,
      directionality: this.Direction,
      language: this.Language == CoreEnums.Lang.Ar ? 'ar' : 'en_US',
      plugins: ['link paste table image code lists advlist'],
      default_link_target: "_blank",
      link_title: false,
      target_list: false,
      menubar: this.MenuBarsToShow,
      toolbar: this.ToolBarsToShow,
      mode: 'specific_textareas',
      image_title: true,
      branding: false,
      file_picker_types: 'image',
      images_upload_url: 'empty-url',
      relative_urls: false,
      remove_script_host: false,
      convert_urls: true,
      images_upload_handler: (blobInfo: any, success: any, failure: any) => {

        let file = blobInfo.blob();
        //console.log(file);
        //console.log(blobInfo.base64());

        let uploadedfile: any = {
          fileName: CoreHelper.NewGuid() + '.' + CoreHelper.GetFileExtension(file.name),
          data: null
        }

        var deferred = jQuery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e: any) {
          deferred.resolve(e.target.result).promise().done((x) => {
            uploadedfile.data = x;

            //TODO:: Upload Attachments
            //me.olomnaSVC.uploadCPCImages([uploadedfile], false).subscribe((res: any) => {
            //  success(environment.SPEndPoint + res[0].d.ServerRelativeUrl)
              
            //});

          });
        };
        reader.readAsArrayBuffer(file);




        //console.log(uploadedfile);



        //let item = `<img src="data:image/jpeg;base64,${blobInfo.base64()}" />`
        //this.AddItem(item);
        //success(`data:image/jpeg;base64,${blobInfo.base64()}`)
        // on images upload
        //success('');
      },
      editor_selector: 'mceEditor',
      skin: 'oxide',
      setup: (editor: any) => {
        this.Editor = editor;
        //this.Editor.setContent('asdasdasd');
        //tinymce.get(this.UniqeId).setContent('<p>This is my new content!</p>');

        //stinymce.get(this.UniqeId).getBody().innerHTML = '<p>This is my new content!</p>';

        editor.on('blur', () => {
          this.emitValue();

        });
        editor.on('keyup', () => {
          this.emitValue();

        });
      },
    });


    //setInterval(() => {
    //  this.Editor.setContent('<p>This is my new content!</p>');
    //}, 1000)

    //tinymce.get(this.UniqeId).setContent('<p>This is my new content!</p>');
    //tinymce.get(this.UniqeId).getBody().innerHTML = '<p>This is my new content!</p>';
  }

  emitValue() {
    this.GeneratedHTML = this.Editor.getContent();
    this.propagateChange(this.GeneratedHTML);
  }

  AddItem(item: string) {
    if (tinymce.editors.find((x: any) => x.id == this.UniqeId)) {
      tinymce.editors.find((x: any) => x.id == this.UniqeId).execCommand('mceInsertContent', false, item);
    }

  }

}
