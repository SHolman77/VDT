﻿using System.Web.Mvc;
using vdt.demo.Models;
using vdt.jquerydropdownlist.MVC;

namespace vdt.demo.Controllers {
    [RoutePrefix("Dropdownlist")]
    public class DropdownlistController : Controller {
        [Route]
        [Route("Index")]
        public ActionResult Index() {
            return View(new ExampleDropdownlistViewModel() {
                DemoProperty = new JQueryDropdownlist() {
                    Items = new[] {
                        new JQueryDropdownlistItem() { Value = "1a", Text = "Option 1a" },
                        new JQueryDropdownlistItem() { Value = "1b", Text = "Option 1b" },
                        new JQueryDropdownlistItem() { Value = "2", Text = "Choice 2" },
                        new JQueryDropdownlistItem() { Value = "3", Text = "Third choice" }
                    },
                    SelectedValues = new[] { "1b", "2" },
                    IsMultiselect = true,
                    HasTextSearch = true,
                    HasSelectAll = true,
                    GetSelectAllText = () => "Select all items"
                },
                DemoProperty2 = new JQueryDropdownlist() {
                    Items = new[] {
                        new JQueryDropdownlistItem() { Value = "1a", Text = "Option 1a" },
                        new JQueryDropdownlistItem() { Value = "1b", Text = "Option 1b" },
                        new JQueryDropdownlistItem() { Value = "2", Text = "Choice 2" },
                        new JQueryDropdownlistItem() { Value = "3", Text = "Third choice" }
                    }
                }
            });
        }

        [Route]
        [Route("Index")]
        [HttpPost]
        public ActionResult Index(ExampleDropdownlistViewModel viewModel) {
            viewModel.DemoProperty = viewModel.DemoProperty ?? new JQueryDropdownlist();
            viewModel.DemoProperty.Items = new[] {
                new JQueryDropdownlistItem() { Value = "1a", Text = "Option 1a" },
                new JQueryDropdownlistItem() { Value = "1b", Text = "Option 1b" },
                new JQueryDropdownlistItem() { Value = "2", Text = "Choice 2" },
                new JQueryDropdownlistItem() { Value = "3", Text = "Third choice" }
            };
            viewModel.DemoProperty.IsMultiselect = true;
            viewModel.DemoProperty.HasTextSearch = true;
            viewModel.DemoProperty.HasSelectAll = true;
            viewModel.DemoProperty.GetSelectAllText = () => "Select all items";

            viewModel.DemoProperty2 = viewModel.DemoProperty2 ?? new JQueryDropdownlist();
            viewModel.DemoProperty2.Items = new[] {
                new JQueryDropdownlistItem() { Value = "1a", Text = "Option 1a" },
                new JQueryDropdownlistItem() { Value = "1b", Text = "Option 1b" },
                new JQueryDropdownlistItem() { Value = "2", Text = "Choice 2" },
                new JQueryDropdownlistItem() { Value = "3", Text = "Third choice" }
            };

            return View(viewModel);
    }
}
}