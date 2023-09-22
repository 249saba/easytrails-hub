<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * @var null
     */
    protected $message = null;

    /**
     * @param $message
     * @return $this
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
        /*return [
            'id' => $this->id,
 			'first_name' => $this->first_name,
 			'last_name' => $this->last_name,
 			'email' => $this->email,
 			'email_verified_at' => $this->email_verified_at,
 			'password' => $this->password,
 			'active' => $this->active,
 			'phone_number' => $this->phone_number,
 			'hub_admin' => $this->hub_admin,
 			'country_id' => $this->country_id,
 			'timezone_id' => $this->timezone_id,
 			'last_login' => $this->last_login,
 			'login_attempts' => $this->login_attempts,
 			'created_by' => $this->created_by,
 			'updated_by' => $this->updated_by,
 			'pin_code' => $this->pin_code,
 			'invited_by' => $this->invited_by,
 			'invited_at' => $this->invited_at,
 			'remember_token' => $this->remember_token,
 			'created_at' => $this->created_at,
 			'updated_at' => $this->updated_at,
 			'deleted_at' => $this->deleted_at,

        ];*/
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @param Request $request
     * @return array
     */
    public function with($request)
    {
        return [
            'success' => true,
            'message' => $this->message,
            'meta' => null,
            'errors' => null
        ];
    }
}
