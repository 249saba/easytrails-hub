<x-mail::message>

# Hello {{ $user->first_name }} {{ $user->last_name }},

You have been invited to collaborate.

Please click on the link below to accept the invitation.

@component('mail::button', ['url' => $url])
    Accept Invitation
@endcomponent

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
