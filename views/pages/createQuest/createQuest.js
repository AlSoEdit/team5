/* global $:true */

require('../../styles/container/container.css');
require('../../styles/input-autocomplete/input-autocomplete');
require('../../styles/add-quest/add-quest');
require('../../styles/tags/tags');

$('#title, #city, #description').on('blur', function () {
    if ($(this).val() === '') {
        $(this).addClass('input_error');
        $(this).attr('placeholder', 'Please enter ' + $(this).attr('id'));
    } else {
        $(this).removeClass('input_error');
    }

    var empty = false;

    $('input:required, textarea:required').each(function (idx, el) {
        var value = $(el).val();
        if (/^\s*$/.test(value)) {
            empty = true;
        }
    });

    if (empty) {
        $('button[role="createQuest"], button[role="editQuest"]').addClass('btn_disabled');
    } else {
        $('button[role="createQuest"], button[role="editQuest"]').removeClass('btn_disabled');
    }
});

$('button[role="editQuest"]').on('click', function () {
    if ($(this).hasClass('btn_disabled')) {
        return;
    }

    var tags = [];

    $('.tag').each(function (idx, el) {
        var tag = $(el).text().trim();
        tags.push(tag);
    });

    var msg = {};
    msg.title = $('#title').val();
    msg.description = $('#description').val();
    msg.city = $('#city').val();
    msg.slug = $('#slug').val();
    msg.tags = tags;

    $.ajax({
        type: 'POST',
        url: '/api/quests/' + msg.slug + '/edit', // SLUG
        data: msg,
        success: function (data) {
            $('.container').html('Квест успешно изменен =)');

            setTimeout(function () {
                window.location.href = '/quests/' + data.slug;
            }, 2000);
        },
        error: function () {
            $('.container').html('При изменении квеста произошла ошибка, попробуйте еще раз =(');

            setTimeout(function () {
                window.location.reload();
            }, 2000);
        }
    });
});

$('button[role="createQuest"]').on('click', function () {
    if ($(this).hasClass('btn_disabled')) {
        return;
    }

    var stagesForms = $('.quests-content form');
    var tags = [];

    $('.tag').each(function (idx, el) {
        var tag = $(el).text().trim();
        tags.push(tag);
    });

    sendForm();

    function sendForm() {
        var msg = {};
        msg.title = $('#title').val();
        msg.description = $('#description').val();
        msg.city = $('#city').val();
        msg.tags = tags;

        $.ajax({
            type: 'POST',
            url: '/api/quests',
            data: msg,
            success: function (data) {
                $(stagesForms).each(function (idx, el) {
                    sendStageForm(el, data.slug);
                });

                $('.container').html('Квест успешно создан =)');

                setTimeout(function () {
                    window.location.href = '/quests/' + data.slug;
                }, 2000);
            },
            error: function () {
                $('.container').html('При создании квеста произошла ошибка, попробуйте еще раз =(');

                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            }
        });
    }

    function sendStageForm(form, slug) {
        var msg = $(form).serialize();
        $.ajax({
            type: 'POST',
            url: '/api/quests/' + slug + '/stages',
            data: msg,
            success: function () {

            },
            error: function () {

            }
        });
    }
});

$('.quests-content').on('keyup', '.title', function () {
    var panel = $(this).closest('.tab-content__panel');
    var id = $(panel).attr('id');

    var tab = $('.tabs').find('a[href="#' + id + '"]');
    var val = $(this).val();
    if (/^\s*$/.test(val)) {
        $(tab).html('Без названия');
    } else {
        $(tab).html(val);
    }
});

$('.quests-content').on('click', '.add-quest_delete', function () {
    var tabContent = $(this).parent();

    var tabId = $(tabContent).attr('id');
    var tab = $('.add-quest__tabs').find('a[href="#' + tabId + '"]').parent();

    $(tab).remove();
    $(tabContent).remove();

    var newActiveTab = $('.add-quest__tabs').children();
    if (newActiveTab.length > 0) {
        $(newActiveTab[0]).find('.tabs__link').addClass('active');
    }

    var newActiveTabContent = $('.quests-content').children();
    if (newActiveTabContent.length > 0) {
        $(newActiveTabContent[0]).addClass('active');
    }
});
