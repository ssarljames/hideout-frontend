import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterContentInit,
  ViewChild,
  AfterViewChecked,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-material-input",
  templateUrl: "./material-input.component.html",
  styleUrls: ["./material-input.component.scss"],
})
export class MaterialInputComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() class: string;
  @Input() placeholder: string;
  @Input() type: string;
  @Input() icon: string;
  @Input() disabled: boolean;
  @Output() onEnter: EventEmitter<any>;
  @Input() hasActionButton: boolean;
  @Input() hint: string;

  @Input() focusOnInit: boolean;

  @Input() appearance: "legacy" | "standard" | "fill" | "outline";

  @Output() onActionButtonClicked: EventEmitter<any>;

  @ViewChild("input") input: ElementRef;

  constructor() {
    this.onEnter = new EventEmitter();
    this.onActionButtonClicked = new EventEmitter();
  }

  ngOnInit(): void {
    this.placeholder = this.placeholder ? this.placeholder : this.label;
    this.label = this.label ? this.label : this.placeholder;
    this.type = this.type ? this.type : "text";

    this.appearance = this.appearance ? this.appearance : "standard";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.disabled)
      if (changes.disabled.currentValue) this.control.disable();
      else this.control.enable();
  }

  ngAfterViewInit(): void {
    if (
      this.focusOnInit &&
      this.input &&
      this.input.nativeElement !== document.activeElement
    ) {
      setTimeout(() => {
        this.input.nativeElement.focus();
      }, 500);
    }
  }

  keyup(e: KeyboardEvent): void {
    if (e.key == "Enter") {
      this.onEnter.emit(this.control.value);
    }

    if (e.key == "Escape") this.control.setValue("");
  }

  _actionButtonClicked(): void {
    this.onActionButtonClicked.emit(this.control);
  }
}
