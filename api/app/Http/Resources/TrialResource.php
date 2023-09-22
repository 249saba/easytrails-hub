<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrialResource extends JsonResource
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
 			'sponsor_id' => $this->sponsor_id,
 			'name' => $this->name,
 			'email' => $this->email,
 			'active' => $this->active,
 			'recruitment_url' => $this->recruitment_url,
 			'study_number' => $this->study_number,
 			'contact_number' => $this->contact_number,
 			'short_code' => $this->short_code,
 			'app_name' => $this->app_name,
 			'app_store_url' => $this->app_store_url,
 			'play_store_url' => $this->play_store_url,
 			'description' => $this->description,
 			'has_appointment_locations' => $this->has_appointment_locations,
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
