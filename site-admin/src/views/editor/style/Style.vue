<template>
  <div class="pb-3">
    <div v-if="className">
      <div
        class="m-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-4 shadow-sm text-slate-600"
      >
        <div class="flex items-center justify-between">
          <div class="text-slate-800 text-sm font-medium flex items-center">
            Classes
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-600" />
        </div>
        <div class="border-b" id="collapse-kD00DeXN">
          <div class="width-and-height-settings pt-1">
            <!-- Size lists: SM, MD , LG, XL, XL -->
            <Size
              :option="classWeight"
              @onSelect="(data) => (classWeight = data)"
            />
            <div class="flex items-center flex-wrap gap-2">
              <button
                v-for="token in weightedClassTokens"
                :key="token"
                type="button"
                class="chip-token"
                @click="removeClassToken(token)"
              >
                <span class="text-xs font-medium tracking-wide">{{
                  token
                }}</span>
                <span class="ml-2 text-[11px] font-semibold leading-none"
                  >×</span
                >
              </button>
            </div>
            <div class="my-4">
              <Search
                @onSelect="
                  (data) => {
                    const completeClass = classWeight
                      ? `${classWeight}:${data}`
                      : data;
                    addClassToken(completeClass);
                  }
                "
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="m-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-4 shadow-sm text-slate-600"
      >
        <div class="flex items-center justify-between">
          <div class="text-slate-800 text-sm font-medium flex items-center">
            Weight and Height
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-600" />
        </div>
        <div class="border-b" id="collapse-kD00DeXN">
          <div class="width-and-height-settings pt-1">
            <!-- Size lists: SM, MD , LG, XL, XL -->
            <Size
              :option="sizeWeight"
              @onSelect="(data) => (sizeWeight = data)"
            />
            <!-- Width: w-full  -->
            <div class="grid grid-cols-2 gap-3 items-center mb-4">
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'w',
                        className.value,
                        width,
                        data,
                        sizeWeight
                      );
                    });
                  }
                "
                :option="getOption('w', className.value, width, sizeWeight)"
                :options="width"
                :title="'Width'"
              />
              <!-- Height: h-screen -->
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'h',
                        className.value,
                        height,
                        data,
                        sizeWeight
                      );
                    });
                  }
                "
                :option="getOption('h', className.value, height, sizeWeight)"
                :options="height"
                :title="'Height'"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="m-2 rounded-xl border border-slate-200 bg-white/95 px-3 py-4 shadow-sm text-slate-600"
      >
        <div class="flex items-center justify-between">
          <div class="text-slate-800 text-sm font-medium flex items-center">
            Colors
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-600" />
        </div>
        <div class="border-b" id="collapse-FmXBlCap">
          <div class="colors-settings pt-1">
            <Size
              :option="sizeColor"
              @onSelect="(data) => (sizeColor = data)"
            />
            <div class="grid grid-cols-2 gap-3 mb-3">
              <Color
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'bg',
                        className.value,
                        listColors,
                        data,
                        sizeColor
                      );
                    });
                  }
                "
                :option="
                  getOption('bg', className.value, listColors, sizeColor)
                "
                :title="'BG Color'"
              />

              <Color
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'text',
                        className.value,
                        listColors,
                        data,
                        sizeColor
                      );
                    });
                  }
                "
                :option="
                  getOption('text', className.value, listColors, sizeColor)
                "
                :title="'Color'"
              />
              <Color
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'border',
                        className.value,
                        listColors,
                        data,
                        sizeColor
                      );
                    });
                  }
                "
                :option="
                  getOption('border', className.value, listColors, sizeColor)
                "
                :title="'Border'"
              />
              <div class="col-span-2">
                <Color
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = replaceOption(
                          'shadow',
                          className.value,
                          listColors,
                          data,
                          sizeColor
                        );
                      });
                    }
                  "
                  :option="
                    getOption('shadow', className.value, listColors, sizeColor)
                  "
                  :title="'Shadow'"
                />
              </div>
              <Color
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'accent',
                        className.value,
                        listColors,
                        data,
                        sizeColor
                      );
                    });
                  }
                "
                :option="
                  getOption('accent', className.value, listColors, sizeColor)
                "
                :title="'Accent'"
              />
              <Color
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'decoration',
                        className.value,
                        listColors,
                        data,
                        sizeColor
                      );
                    });
                  }
                "
                :option="
                  getOption(
                    'decoration',
                    className.value,
                    listColors,
                    sizeColor
                  )
                "
                :title="'Text Decor'"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white text-[#8f8e8e] px-4 py-2">
        <div class="flex items-center justify-between">
          <div class="text-slate-800 text-sm font-medium flex items-center">
            Margin
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-600" />
        </div>
        <div class="border-b" id="collapse-Ej8JqzCK">
          <div class="margin-and-padding-settings pt-1">
            <Size
              :option="sizeMargin"
              @onSelect="(data) => (sizeMargin = data)"
            />
            <div class="">
              <h6
                class="text-slate-800 text-sm font-medium flex items-center mb-2"
              >
                Margin
              </h6>
              <div class="flex flex-wrap mx-0 items-center mb-4 justify-center">
                <div class="flex-shrink-0 flex-grow-0 w-full max-w-full">
                  <List
                    @onSelect="
                      (data) => {
                        reka.change(() => {
                          className.value = replaceOption(
                            'mt',
                            className.value,
                            margin,
                            data,
                            sizeMargin
                          );
                        });
                      }
                    "
                    :option="
                      getOption('mt', className.value, margin, sizeMargin)
                    "
                    :options="margin"
                    class="w-[60px] mx-auto"
                    :title="''"
                  />
                </div>
                <List
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = replaceOption(
                          'ml',
                          className.value,
                          margin,
                          data,
                          sizeMargin
                        );
                      });
                    }
                  "
                  :option="getOption('ml', className.value, margin, sizeMargin)"
                  :options="margin"
                  class="w-[60px]"
                  :title="''"
                />
                <div class="col-auto m-2">
                  <img
                    src="https://windframe.devwares.com/editor-margin.svg"
                    alt="editor-margin"
                    width="60"
                  />
                </div>

                <List
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = replaceOption(
                          'mr',
                          className.value,
                          margin,
                          data,
                          sizeMargin
                        );
                      });
                    }
                  "
                  :option="getOption('mr', className.value, margin, sizeMargin)"
                  :options="margin"
                  class="w-[60px]"
                  :title="''"
                />
                <div class="-mt-1 flex-shrink-0 flex-grow-0 w-full max-w-full">
                  <List
                    @onSelect="
                      (data) => {
                        reka.change(() => {
                          className.value = replaceOption(
                            'mb',
                            className.value,
                            margin,
                            data,
                            sizeMargin
                          );
                        });
                      }
                    "
                    :option="
                      getOption('mb', className.value, margin, sizeMargin)
                    "
                    :options="margin"
                    class="w-[60px] mx-auto"
                    :title="''"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <List
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = replaceOption(
                          'my',
                          className.value,
                          margin,
                          data,
                          sizeMargin
                        );
                      });
                    }
                  "
                  :option="getOption('my', className.value, margin, sizeMargin)"
                  :options="margin"
                  :title="'Y-axis'"
                />

                <List
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = replaceOption(
                          'mx',
                          className.value,
                          margin,
                          data,
                          sizeMargin
                        );
                      });
                    }
                  "
                  :option="getOption('mx', className.value, margin, sizeMargin)"
                  :options="margin"
                  :title="'X-axis'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white text-[#8f8e8e] px-4 py-2">
        <div class="flex items-center justify-between">
          <div class="text-slate-800 text-sm font-medium flex items-center">
            Padding
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-600" />
        </div>
        <div class="border-b" id="collapse-X0zmvnkD">
          <div class="padding-settings pt-1">
            <Size
              :option="sizePadding"
              @onSelect="(data) => (sizePadding = data)"
            />
            <div class="">
              <h6
                class="text-slate-800 text-sm font-medium flex items-center mb-2"
              >
                Padding
              </h6>
              <div class="flex flex-wrap mx-0 items-center mb-4 justify-center">
                <div class="flex-shrink-0 flex-grow-0 w-full max-w-full">
                  <List
                    @onSelect="
                      (data) => {
                        reka.change(() => {
                          className.value = replaceOption(
                            'pt',
                            className.value,
                            padding,
                            data,
                            sizePadding
                          );
                        });
                      }
                    "
                    :option="
                      getOption('pt', className.value, padding, sizePadding)
                    "
                    :options="padding"
                    class="w-[60px] mx-auto"
                    :title="''"
                  />
                </div>
                <List
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = replaceOption(
                          'pl',
                          className.value,
                          padding,
                          data,
                          sizePadding
                        );
                      });
                    }
                  "
                  :option="
                    getOption('pl', className.value, padding, sizePadding)
                  "
                  :options="padding"
                  class="w-[60px]"
                  :title="''"
                />
                <div class="col-auto m-2">
                  <img
                    src="https://windframe.devwares.com/editor-padding.svg"
                    alt="editor-padding"
                    width="60"
                  />
                </div>

                <List
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = replaceOption(
                          'pr',
                          className.value,
                          padding,
                          data,
                          sizePadding
                        );
                      });
                    }
                  "
                  :option="
                    getOption('pr', className.value, padding, sizePadding)
                  "
                  :options="padding"
                  class="w-[60px]"
                  :title="''"
                />
                <div class="-mt-1 flex-shrink-0 flex-grow-0 w-full max-w-full">
                  <List
                    @onSelect="
                      (data) => {
                        reka.change(() => {
                          className.value = replaceOption(
                            'pb',
                            className.value,
                            padding,
                            data,
                            sizePadding
                          );
                        });
                      }
                    "
                    :option="
                      getOption('pb', className.value, padding, sizePadding)
                    "
                    :options="padding"
                    class="w-[60px] mx-auto"
                    :title="''"
                  />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 mb-3">
                <List
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = replaceOption(
                          'py',
                          className.value,
                          padding,
                          data,
                          sizePadding
                        );
                      });
                    }
                  "
                  :option="
                    getOption('py', className.value, padding, sizePadding)
                  "
                  :options="padding"
                  :title="'Y-axis'"
                />

                <List
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = replaceOption(
                          'px',
                          className.value,
                          padding,
                          data,
                          sizePadding
                        );
                      });
                    }
                  "
                  :option="
                    getOption('px', className.value, padding, sizePadding)
                  "
                  :options="padding"
                  :title="'X-axis'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white text-[#8f8e8e] px-4 py-2">
        <div class="flex items-center justify-between">
          <div class="text-slate-800 text-sm font-medium flex items-center">
            Decoration
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-600" />
        </div>
        <div class="border-b" id="collapse-k9iNwx0L">
          <div class="decoration-settings pt-1">
            <Size
              :option="sizeDecoration"
              @onSelect="(data) => (sizeDecoration = data)"
            />
            <div class="grid grid-cols-2 gap-3 mb-3">
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'rounded',
                        className.value,
                        radius,
                        data,
                        sizeDecoration
                      );
                    });
                  }
                "
                :option="
                  getOption('rounded', className.value, radius, sizeDecoration)
                "
                :options="radius"
                :title="'Radius'"
              />
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'border',
                        className.value,
                        border,
                        data,
                        sizeDecoration
                      );
                    });
                  }
                "
                :option="
                  getOption('border', className.value, border, sizeDecoration)
                "
                :options="border"
                :title="'Border'"
              />
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'shadow',
                        className.value,
                        shadow,
                        data,
                        sizeDecoration
                      );
                    });
                  }
                "
                :option="
                  getOption('shadow', className.value, shadow, sizeDecoration)
                "
                :options="shadow"
                :title="'Shadow'"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white text-[#8f8e8e] px-4 py-2">
        <div class="flex items-center justify-between">
          <div class="text-slate-800 text-sm font-medium flex items-center">
            Font Style
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-600" />
        </div>
        <div class="border-b" id="collapse-KoZstoyb">
          <div class="font-styles-settings pt-1">
            <Size :option="sizeFont" @onSelect="(data) => (sizeFont = data)" />
            <div class="">
              <h6
                class="text-slate-800 text-sm font-medium flex items-center mb-2"
              >
                Text Decoration
              </h6>
              <div class="flex items-center flex-wrap gap-3">
                <Select
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = new RegExp(
                          `\\b${escapeRegex(data)}\\b`
                        ).test(className.value)
                          ? className.value
                              .replace(
                                new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                                ''
                              )
                              .trim()
                              .replace(/\s+/g, ' ')
                          : `${className.value} ${data}`
                              .trim()
                              .replace(/\s+/g, ' ');
                      });
                    }
                  "
                  @onRemove="
                    (data) => {
                      reka.change(() => {
                        className.value = new RegExp(
                          `\\b${escapeRegex(data)}\\b`
                        ).test(className.value)
                          ? className.value
                              .replace(
                                new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                                ''
                              )
                              .trim()
                              .replace(/\s+/g, ' ')
                          : `${className.value} ${data}`
                              .trim()
                              .replace(/\s+/g, ' ');
                      });
                    }
                  "
                  :option="
                    ['italic'].find((item) => className.value.includes(item)) ||
                    null
                  "
                  :options="[
                    {
                      name: 'italic',
                      image:
                        'https://windframe.devwares.com/icons/editor-text-decoration-italic.svg',
                    },
                  ]"
                  :title="'Font Style'"
                />
                <Select
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = new RegExp(
                          `\\b${escapeRegex(data)}\\b`
                        ).test(className.value)
                          ? className.value
                              .replace(
                                new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                                ''
                              )
                              .trim()
                              .replace(/\s+/g, ' ')
                          : `${className.value} ${data}`
                              .trim()
                              .replace(/\s+/g, ' ');
                      });
                    }
                  "
                  @onRemove="
                    (data) => {
                      reka.change(() => {
                        className.value = new RegExp(
                          `\\b${escapeRegex(data)}\\b`
                        ).test(className.value)
                          ? className.value
                              .replace(
                                new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                                ''
                              )
                              .trim()
                              .replace(/\s+/g, ' ')
                          : `${className.value} ${data}`
                              .trim()
                              .replace(/\s+/g, ' ');
                      });
                    }
                  "
                  :option="
                    ['strike-through'].find((item) =>
                      className.value.includes(item)
                    ) || null
                  "
                  :options="[
                    {
                      name: 'strike-through',
                      image:
                        'https://windframe.devwares.com/icons/editor-text-decoration-strike.svg',
                    },
                  ]"
                  :title="'Font Style'"
                />
                <Select
                  @onSelect="
                    (data) => {
                      reka.change(() => {
                        className.value = new RegExp(
                          `\\b${escapeRegex(data)}\\b`
                        ).test(className.value)
                          ? className.value
                              .replace(
                                new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                                ''
                              )
                              .trim()
                              .replace(/\s+/g, ' ')
                          : `${className.value} ${data}`
                              .trim()
                              .replace(/\s+/g, ' ');
                      });
                    }
                  "
                  @onRemove="
                    (data) => {
                      reka.change(() => {
                        className.value = new RegExp(
                          `\\b${escapeRegex(data)}\\b`
                        ).test(className.value)
                          ? className.value
                              .replace(
                                new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                                ''
                              )
                              .trim()
                              .replace(/\s+/g, ' ')
                          : `${className.value} ${data}`
                              .trim()
                              .replace(/\s+/g, ' ');
                      });
                    }
                  "
                  :option="
                    ['underline'].find((item) =>
                      className.value.includes(item)
                    ) || null
                  "
                  :options="[
                    {
                      name: 'underline',
                      image:
                        'https://windframe.devwares.com/icons/editor-text-decoration-underline.svg',
                    },
                  ]"
                  :title="'Font Style'"
                />
              </div>
            </div>
            <div class="mt-3">
              <h6
                class="text-slate-800 text-sm font-medium flex items-center mb-2"
              >
                Text Decoration Offset
              </h6>

              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'underline-offset',
                        className.value,
                        textDecoration,
                        data,
                        sizeFont
                      );
                    });
                  }
                "
                :option="
                  getOption(
                    'underline-offset',
                    className.value,
                    textDecoration,
                    sizeFont
                  )
                "
                :options="textDecoration"
                :title="''"
              />
            </div>
            <div class="mt-3">
              <h6
                class="text-slate-800 text-sm font-medium flex items-center mb-2"
              >
                Text Align
              </h6>
              <Select
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = new RegExp(
                        `\\b${escapeRegex(data)}\\b`
                      ).test(className.value)
                        ? className.value
                            .replace(
                              new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                              ''
                            )
                            .trim()
                            .replace(/\s+/g, ' ')
                        : `${className.value} ${data}`
                            .trim()
                            .replace(/\s+/g, ' ');
                    });
                  }
                "
                @onRemove="
                  (data) => {
                    reka.change(() => {
                      className.value = new RegExp(
                        `\\b${escapeRegex(data)}\\b`
                      ).test(className.value)
                        ? className.value
                            .replace(
                              new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                              ''
                            )
                            .trim()
                            .replace(/\s+/g, ' ')
                        : `${className.value} ${data}`
                            .trim()
                            .replace(/\s+/g, ' ');
                    });
                  }
                "
                :option="
                  [
                    'text-none',
                    'text-left',
                    'text-center',
                    'text-right',
                    'text-justify',
                  ].find((item) => className.value.includes(item)) || null
                "
                :options="[
                  {
                    name: 'text-none',
                    image:
                      'https://windframe.devwares.com/icons/editor-none.svg',
                  },
                  {
                    name: 'text-left',
                    image:
                      'https://windframe.devwares.com/icons/editor-text-align-left.svg',
                  },
                  {
                    name: 'text-center',
                    image:
                      'https://windframe.devwares.com/icons/editor-text-align-center.svg',
                  },
                  {
                    name: 'text-right',
                    image:
                      'https://windframe.devwares.com/icons/editor-text-align-right.svg',
                  },
                  {
                    name: 'text-justify',
                    image:
                      'https://windframe.devwares.com/icons/editor-text-align-justify.svg',
                  },
                ]"
                :title="'Font Style'"
              />
            </div>
            <div class="mt-3 mb-3">
              <h6
                class="text-slate-800 text-sm font-medium flex items-center mb-2"
              >
                Text Transform
              </h6>
              <Select
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = new RegExp(
                        `\\b${escapeRegex(data)}\\b`
                      ).test(className.value)
                        ? className.value
                            .replace(
                              new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                              ''
                            )
                            .trim()
                            .replace(/\s+/g, ' ')
                        : `${className.value} ${data}`
                            .trim()
                            .replace(/\s+/g, ' ');
                    });
                  }
                "
                @onRemove="
                  (data) => {
                    reka.change(() => {
                      className.value = new RegExp(
                        `\\b${escapeRegex(data)}\\b`
                      ).test(className.value)
                        ? className.value
                            .replace(
                              new RegExp(`\\b${escapeRegex(data)}\\b`, 'g'),
                              ''
                            )
                            .trim()
                            .replace(/\s+/g, ' ')
                        : `${className.value} ${data}`
                            .trim()
                            .replace(/\s+/g, ' ');
                    });
                  }
                "
                :option="
                  [
                    'text-none',
                    'text-uppercase',
                    'text-capitalize',
                    'text-lowercase',
                  ].find((item) => className.value.includes(item)) || null
                "
                :options="[
                  {
                    name: 'text-none',
                    image:
                      'https://windframe.devwares.com/icons/editor-none.svg',
                  },
                  {
                    name: 'text-uppercase',
                    image:
                      'https://windframe.devwares.com/icons/editor-text-transform-uppercase.svg',
                  },
                  {
                    name: 'text-capitalize',
                    image:
                      'https://windframe.devwares.com/icons/editor-text-transform-capitalize.svg',
                  },
                  {
                    name: 'text-lowercase',
                    image:
                      'https://windframe.devwares.com/icons/editor-text-transform-lowercase.svg',
                  },
                ]"
              />
            </div>
            <div class="grid grid-cols-2 gap-3 mb-3">
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'font',
                        className.value,
                        family,
                        data,
                        sizeFont
                      );
                    });
                  }
                "
                :option="getOption('font', className.value, family, sizeFont)"
                :options="family"
                :title="'Family'"
              />
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'text',
                        className.value,
                        size,
                        data,
                        sizeFont
                      );
                    });
                  }
                "
                :option="getOption('text', className.value, size, sizeFont)"
                :options="size"
                :title="'Size'"
              />
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'leading',
                        className.value,
                        lineHeight,
                        data,
                        sizeFont
                      );
                    });
                  }
                "
                :option="
                  getOption('leading', className.value, lineHeight, sizeFont)
                "
                :options="lineHeight"
                :title="'Line Height'"
              />
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'font',
                        className.value,
                        weight,
                        data,
                        sizeFont
                      );
                    });
                  }
                "
                :option="getOption('font', className.value, weight, sizeFont)"
                :options="weight"
                :title="'Weight'"
              />
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'tracking',
                        className.value,
                        letterSpacing,
                        data,
                        sizeFont
                      );
                    });
                  }
                "
                :option="
                  getOption(
                    'tracking',
                    className.value,
                    letterSpacing,
                    sizeFont
                  )
                "
                :options="letterSpacing"
                :title="'Letter Spacing'"
              />
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = replaceOption(
                        'break',
                        className.value,
                        wordBreak,
                        data,
                        sizeFont
                      );
                    });
                  }
                "
                :option="
                  getOption('break', className.value, wordBreak, sizeFont)
                "
                :options="wordBreak"
                :title="'Word Break'"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white text-[#8f8e8e] px-4 py-2">
        <div class="flex items-center justify-between">
          <div class="text-slate-800 text-sm font-medium flex items-center">
            Background
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-600" />
        </div>
        <div class="border-b" id="collapse-aVK2Y6MM">
          <div class="mx-2 mb-3">
            <div
              class="prop-text"
              style="width: 100%; position: relative; padding: 0px"
            >
              <h6 class="p-0 text-[#494949]">Background Image Link</h6>
              <input
                class="border-[2px] $ border-[#ced4da] focus:border-black"
                value="#"
                style="width: 100%; margin: 0px"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="bg-white text-[#8f8e8e] px-4 py-2">
        <div class="flex items-center justify-between">
          <div class="text-slate-800 text-sm font-medium flex items-center">
            Display
          </div>
          <ChevronDownIcon class="h-4 w-4 text-gray-600" />
        </div>
        <div class="border-b" id="collapse-B0xz3fNE">
          <div class="alignment-settings pt-1">
            <Size
              :option="sizeDisplay"
              @onSelect="(data) => (sizeDisplay = data)"
            />
            <div class="grid grid-cols-2 gap-3 mb-3">
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = className.value.replace(
                        new RegExp(
                          display.map((item) => `\\b${item}\\S*`).join('|') +
                            '|$'
                        ),
                        (match) => (match ? ' ' + data : ' ' + data)
                      );
                    });
                  }
                "
                :option="
                  display.find((item) => className.value.includes(item)) || null
                "
                :options="display"
                :title="'Display'"
              />
              <List
                @onSelect="
                  (data) => {
                    reka.change(() => {
                      className.value = className.value.replace(
                        new RegExp(
                          flex.map((item) => `\\b${item}\\S*`).join('|') + '|$'
                        ),
                        (match) => (match ? ' ' + data : ' ' + data)
                      );
                    });
                  }
                "
                :option="
                  flex.find((item) => className.value.includes(item)) || null
                "
                :options="flex"
                :title="'Flex Direction'"
              />
              <List :options="height" :title="'Overflow'" />
              <List :options="height" :title="'Fill space'" />
              <List :options="align" :title="'Align Items'" />
              <List :options="justify" :title="'Justify Content'" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="m-2 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-xs font-medium uppercase tracking-wide text-slate-400"
    >
      No class binding attached yet. Add a Tailwind class to unlock styling
      tools.
    </div>
  </div>
</template>
<script setup>
import { ref, computed, defineAsyncComponent, inject } from "vue";
import colors from "tailwindcss/colors";
import {
  ChevronDownIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/vue/24/outline";
import * as t from "@rekajs/types";
import { storeToRefs } from "pinia";
import { useEditorStore } from "@/stores/editor";
const { templateId } = storeToRefs(useEditorStore());
const reka = inject("reka");
const template = computed(() => {
  return reka.value.getNodeFromId(templateId.value);
});
const resolveClassBinding = (binding) => {
  if (!binding) {
    return null;
  }
  if (typeof binding === "string") {
    return binding;
  }
  if (binding.type === "Literal" && binding.id) {
    return reka.value.getNodeFromId(binding.id) ?? binding;
  }
  if (binding.id) {
    return reka.value.getNodeFromId(binding.id) ?? binding;
  }
  return binding;
};

const className = computed(() => {
  const currentTemplate = template.value;
  if (!currentTemplate) {
    return null;
  }
  if (reka.value && currentTemplate.tag === "text") {
    const parent = reka.value.getParentNode(currentTemplate);
    if (!parent) {
      return null;
    }
    if (!(parent.node instanceof t.SlottableTemplate)) {
      return resolveClassBinding(parent.props?.className);
    }
    return resolveClassBinding(parent.props?.className);
  }
  return resolveClassBinding(currentTemplate.props?.className);
});
const Color = defineAsyncComponent(() =>
  import("@/views/editor/style/Color.vue")
);
const List = defineAsyncComponent(() =>
  import("@/views/editor/style/List.vue")
);
const Size = defineAsyncComponent(() =>
  import("@/views/editor/style/Size.vue")
);
const Select = defineAsyncComponent(() =>
  import("@/views/editor/style/Select.vue")
);
const Search = defineAsyncComponent(() =>
  import("@/views/editor/style/Search.vue")
);

const classWeight = ref("");
const sizeWeight = ref("");
const sizeColor = ref("");
const sizeMargin = ref("");
const sizePadding = ref("");
const sizeDecoration = ref("");
const sizeFont = ref("");
const sizeDisplay = ref("");

const cleanWhitespace = (value = "") => value.replace(/\s+/g, " ").trim();
const getClassString = () => {
  const target = className.value;
  if (!target) {
    return "";
  }
  if (typeof target === "string") {
    return target;
  }
  if (typeof target.value === "string") {
    return target.value;
  }
  if (typeof target.value?.value === "string") {
    return target.value.value;
  }
  return "";
};
const updateClassString = (transform) => {
  const target = className.value;
  const current = getClassString();
  const next = cleanWhitespace(transform(current));
  if (!target) {
    return;
  }
  if (!reka?.value?.change) {
    console.warn("[Style] reka change API unavailable");
    return;
  }
  reka.value.change(() => {
    if (typeof target === "string") {
      const parent = reka.value.getParentNode(template.value, t.Template);
      if (parent?.node) {
        if (!parent.node.props) {
          parent.node.props = {};
        }
        parent.node.props.className = t.literal({ value: next });
      }
    } else if (typeof target.value === "string") {
      target.value = next;
    } else if (target.value && typeof target.value.value === "string") {
      target.value.value = next;
    }
  });
};
const addClassToken = (token) => {
  const normalized = token?.trim();
  if (!normalized) {
    return;
  }
  const current = getClassString();
  if (new RegExp(`\\b${escapeRegex(normalized)}\\b`).test(current)) {
    return;
  }
  updateClassString((currentValue) => `${currentValue} ${normalized}`);
};
const removeClassToken = (token) => {
  const normalized = token?.trim();
  if (!normalized) {
    return;
  }
  updateClassString((currentValue) =>
    currentValue.replace(
      new RegExp(`\\b${escapeRegex(normalized)}\\b`, "g"),
      " "
    )
  );
};

const hasAnyClasses = computed(
  () => cleanWhitespace(getClassString()).length > 0
);
const isEmpty = computed(() => !hasAnyClasses.value);

const weightedClassTokens = computed(() => {
  const prefix = classWeight.value ? `${classWeight.value}:` : "";
  return getClassString()
    .split(/\s+/)
    .filter((token) => token && (!prefix || token.includes(prefix)));
});

const copyClasses = async () => {
  const normalized = cleanWhitespace(getClassString());
  if (!normalized) {
    return {
      success: false,
      intent: "info",
      message: "No classes found on this element yet.",
    };
  }
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(normalized);
    } else if (typeof document !== "undefined") {
      const textarea = document.createElement("textarea");
      textarea.value = normalized;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } else {
      throw new Error("Clipboard API not available");
    }
    return {
      success: true,
      message: "Class list copied to clipboard.",
    };
  } catch (error) {
    console.warn("Failed to copy classes", error);
    return {
      success: false,
      intent: "error",
      message: "Unable to copy automatically. Copy the class list manually.",
    };
  }
};

const border = ref([
  "0",
  "2",
  "4",
  "8",
  "t-2",
  "r-2",
  "b-2",
  "l-2",
  "t-4",
  "r-4",
  "b-4",
  "l-4",
  "t-8",
  "r-8",
  "b-8",
  "l-8",
  "t",
  "r",
  "b",
  "l",
]);
const radius = ref([
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "full",
  "t-md",
  "r-md",
  "l-md",
  "b-md",
  "t-lg",
  "r-lg",
  "l-lg",
  "b-lg",
  "t-xl",
  "r-xl",
  "l-xl",
  "b-xl",
  "t-2xl",
  "r-2xl",
  "l-2xl",
  "b-2xl",
  "t-3xl",
  "r-3xl",
  "l-3xl",
  "b-3xl",
  "t-full",
  "r-full",
  "l-full",
  "b-full",
]);
const shadow = ref(["sm", "md", "lg", "xl", "2xl", "inner", "none"]);
const display = ref([
  "hidden",
  "inline",
  "inline-block",
  "block",
  "flex",
  "inline-flex",
]);
const flex = ref(["row", "row-reverse", "col", "col-reverse"]);
const justify = ref(["start", "end", "center", "between", "around", "evenly"]);
const opacity = ref(["start", "center", "end", "baseline", "stretch"]);
const align = ref(["start", "center", "end", "baseline", "stretch"]);
const height = ref([
  "0",
  "auto",
  "px",
  "1/2",
  "1/3",
  "2/3",
  "1/4",
  "2/4",
  "3/4",
  "1/5",
  "2/5",
  "3/5",
  "4/5",
  "1/6",
  "2/6",
  "3/6",
  "4/6",
  "5/6",
  "full",
  "screen",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
]);
let width = ref([
  "0",
  "auto",
  "px",
  "1/2",
  "1/3",
  "2/3",
  "1/4",
  "2/4",
  "3/4",
  "1/5",
  "2/5",
  "3/5",
  "4/5",
  "1/6",
  "2/6",
  "3/6",
  "4/6",
  "5/6",
  "1/12",
  "2/12",
  "3/12",
  "4/12",
  "5/12",
  "6/12",
  "7/12",
  "8/12",
  "9/12",
  "10/12",
  "11/12",
  "full",
  "screen",
  "min",
  "max",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
]);
const margin = ref([
  "auto",
  "0",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
  "-0",
  "-0.5",
  "-1",
  "-1.5",
  "-2",
  "-2.5",
  "-3",
  "-4",
  "-5",
  "-6",
  "-7",
  "-8",
  "-9",
  "-10",
  "-11",
  "-12",
  "-14",
  "-16",
  "-20",
  "-24",
  "-28",
  "-32",
  "-36",
  "-40",
  "-44",
  "-48",
  "-52",
  "-56",
  "-60",
  "-64",
  "-72",
  "-80",
  "-96",
]);
const padding = ref([
  "0",
  "0.5",
  "1",
  "1.5",
  "2",
  "2.5",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "14",
  "16",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96",
]);
const textDecoration = ref(["auto ", "0 ", "1 ", "2 ", "4 ", "8"]);
const family = ref([
  "Arial",
  "Helvetica",
  "monospace",
  "Times",
  "Sans serif",
  "Montserrat",
  "Gotham",
  "Gothic",
  "Myriad",
  "Avenir",
]);
const size = ref([
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
]);
const lineHeight = ref([
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "none",
  "tight",
  "snug",
  "normal",
  "relaxed",
  "loose",
]);
const weight = ref([
  "thin",
  "extralight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
]);
const letterSpacing = ref([
  "tighter",
  "tight",
  "normal",
  "wide",
  "wider",
  "widest",
]);
const wordBreak = ref(["normal", "words", "all"]);

const unwantedColors = [
  "inherit",
  "white",
  "black",
  "current",
  "transparent",
  "lightBlue",
  "warmGray",
  "trueGray",
  "coolGray",
  "blueGray",
];
const colorKeys = Object.keys(colors).filter(
  (base) => !unwantedColors.includes(base)
);

const options = colorKeys.map((base) => ({
  base,
  shades: Object.keys(colors[base]).map((shade) => ({
    name: shade,
    code: colors[base][shade],
  })),
}));

const listColors = ref(["black", "white"]);

colorKeys.forEach((base) => {
  Object.keys(colors[base]).forEach((shade) => {
    listColors.value.push(`${base}-${shade}`);
  });
});

const getOption = (base, className, list, size) => {
  const regex = new RegExp(
    `\\b${size ? size + ":" : ""}${base}-(${list.join("|")})\\b`,
    "g"
  );
  return (className.match(regex) || [null])[0];
};
// Function to replace the matched text with the new text
function replaceOption(base, className, list, data, size) {
  const regex = new RegExp(
    `\\b${size ? size + ":" : ""}${base}-(${list.join("|")})\\b`,
    "g"
  );
  // Replace the matched text with the new color
  const newClassName = className.replace(
    regex,
    `${size ? size + ":" : ""}${base}-${data}`
  );
  // If no replacement was made, append the new color class
  if (newClassName === className) {
    return (className += ` ${size ? size + ":" : ""}${base}-${data}`);
  } else {
    return (className = newClassName);
  }
}
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

defineExpose({
  copyClasses,
  isEmpty,
});
</script>

<style scoped>
.chip-token {
  @apply flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-white text-xs font-medium transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-300;
}
</style>
